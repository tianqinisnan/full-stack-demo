import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@src/components/Avatar';
import { apiService, Conversation } from '@src/services/api';
import { eventBus, EVENT_NAMES } from '@src/utils/eventBus';
import styles from './style.module.css';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchConversations();

    // 订阅新消息事件
    const unsubscribe = eventBus.subscribe(EVENT_NAMES.NEW_MESSAGE, () => {
      fetchConversations();
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  if (loading) {
    return (
      <div className={styles.loading}>加载中...</div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.conversationList}>
        {conversations.map(conversation => (
          <div 
            key={conversation.userId}
            className={styles.conversationItem}
            onClick={() => handleClick(conversation)}
          >
            <Avatar nickname={conversation.nickname} avatarUrl={conversation.avatarUrl} size={48} />
            
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
    </div>
  );
};

export default ChatPage; 