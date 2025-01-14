import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@src/components/Avatar';
import { apiService, Message } from '@src/services/api';
import { userStorage } from '@src/utils/storage';
import styles from './style.module.css';

const ChatRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [nickname, setNickname] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const phone = userStorage.getPhone();
    if (!phone || !id) {
      navigate('/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await apiService.getMessages(id);
        if (response.success && response.data) {
          setMessages(response.data);
        }

        // 获取聊天对象的用户信息
        const userResponse = await apiService.getUserInfo(id);
        if (userResponse.success && userResponse.data) {
          setNickname(userResponse.data.nickname);
        }
      } catch (error) {
        console.error('获取消息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate('/chat');
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !id) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userStorage.getPhone() || '',
      receiverId: id,
      content: inputValue.trim(),
      type: 'text',
      status: 'sending',
      createdAt: new Date().toISOString()
    };

    // 立即添加到消息列表
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    scrollToBottom();

    try {
      const response = await apiService.sendMessage(id, newMessage.content);
      if (response.success && response.data) {
        // 更新消息状态为已发送
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, ...response.data, status: 'sent' as const }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      // 更新消息状态为发送失败
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      );
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backButton} onClick={handleBack}>
          返回
        </div>
        <div className={styles.title}>{nickname}</div>
      </div>

      <div className={styles.messageList} ref={messageListRef}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <>
            {messages.map(message => {
              const isSelf = message.senderId === userStorage.getPhone();
              return (
                <div
                  key={message.id}
                  className={`${styles.messageItem} ${isSelf ? styles.self : ''}`}
                >
                  {!isSelf && <Avatar nickname={nickname} size={40} />}
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}>{message.content}</div>
                    <div className={styles.messageTime}>
                      {formatMessageTime(message.createdAt)}
                      {isSelf && (
                        <span className={styles.messageStatus}>
                          {message.status === 'sending' && '发送中'}
                          {message.status === 'sent' && '已发送'}
                          {message.status === 'read' && '已读'}
                          {message.status === 'failed' && '发送失败'}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelf && <Avatar nickname={userStorage.getPhone() || ''} size={40} />}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="发送消息..."
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatRoom; 