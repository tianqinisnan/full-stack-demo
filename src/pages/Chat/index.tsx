import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@src/components/Avatar';
import TabBar from '@src/components/TabBar';
import { apiService, Conversation } from '@src/services/api';
import { userStorage } from '@src/utils/storage';
import { socketService, EventType } from '@src/services/socket';
import Toast from '@src/components/Toast';
import styles from './style.module.css';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      const response = await apiService.getConversations();
      if (response.success && response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('获取会话列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const phone = userStorage.getPhone() || '';

    fetchConversations();

    // 连接 WebSocket
    socketService.connect();

    // 监听新消息
    const unsubscribeMessage = socketService.onNewMessage((data) => {
      if (data.message.receiverId === phone) {
        Toast.show('新消息来了～');
        fetchConversations();
      }
    });

    return () => {
      unsubscribeMessage();
    };
  }, [navigate]);

  // 格式化最后消息时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      // 今天,显示时间
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (days === 1) {
      return '昨天';
    } else if (days <= 7) {
      // 一周内,显示星期几
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      return '星期' + weekdays[date.getDay()];
    } else {
      // 超过一周,显示日期
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  const handleClick = (conversation: Conversation) => {
    navigate(`/chat/${conversation.userId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        消息列表
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <div className={styles.conversationList}>
            {conversations.map(conversation => (
              <div 
                key={conversation.userId}
                className={styles.conversationItem}
                onClick={() => handleClick(conversation)}
              >
                <Avatar nickname={conversation.nickname} size={48} />
                
                <div className={styles.conversationInfo}>
                  <div className={styles.conversationHeader}>
                    <span className={styles.nickname}>{conversation.nickname}</span>
                    <span className={styles.time}>
                      {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className={styles.lastMessage}>
                    {conversation.lastMessage?.content || '暂无消息'}
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
};

export default ChatPage; 