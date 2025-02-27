import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@src/components/Avatar';
import { apiService, Message } from '@src/services/api';
import { userStorage } from '@src/utils/storage';
import { eventBus, EVENT_NAMES } from '@src/utils/eventBus';
import Toast from '@src/components/Toast';
import styles from './style.module.css';
import { useHeader } from '@src/contexts/HeaderContext';

const ChatRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setConfig } = useHeader();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selfNickname, setSelfNickname] = useState('');
  const [selfAvatarUrl, setSelfAvatarUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const phone = userStorage.getPhone() || '';

  useEffect(() => {
    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // 配置 Header
    setConfig({
      title: nickname || id,
      rightContent: (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div 
            style={{ 
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-mti-gengduo" />
            </svg>
          </div>
          {showDropdown && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#4A4A4A',
                borderRadius: '8px',
                padding: '8px 12px',
                minWidth: '120px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 1000
              }}
            >
              <div
                onClick={handleBack}
                style={{
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#4A4A4A',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLDivElement).style.backgroundColor = '#5A5A5A';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLDivElement).style.backgroundColor = '#4A4A4A';
                }}
              >
                回到聊天列表
              </div>
            </div>
          )}
        </div>
      )
    });
  }, [showDropdown, nickname]);

  useEffect(() => {
    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchMessages();

    // 订阅新消息事件
    const unsubscribeMessage = eventBus.subscribe(EVENT_NAMES.NEW_MESSAGE, (message) => {
      if (message.senderId === id || message.receiverId === id) {
        fetchMessages();
      }
    });

    // 订阅消息已读状态事件
    const unsubscribeRead = eventBus.subscribe(EVENT_NAMES.MESSAGE_READ, (data) => {
      if (data.reader.phone === id) {
        setMessages(prev => 
          prev.map(msg => 
            msg.messageId === data.messageId
              ? { ...msg, status: 'read' as const }
              : msg
          )
        );
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeRead();
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      if (!phone || !id) return;

      const response = await apiService.getMessages(id);
      if (response.success && response.data) {
        setMessages(response.data);
        // 标记所有未读消息为已读
        const unreadMessages = response.data.filter(
          msg => msg.receiverId === phone && msg.status !== 'read'
        );
        for (const msg of unreadMessages) {
          await apiService.markMessageAsRead(msg.messageId.toString());
        }
      }

      // 获取聊天对象的用户信息
      const userResponse = await apiService.getUserInfo(id);
      if (userResponse.success && userResponse.data) {
        setNickname(userResponse.data.nickname);
        setAvatarUrl(userResponse.data.avatarUrl);
      }

      // 获取自己的用户信息
      const selfResponse = await apiService.getUserInfo();
      if (selfResponse.success && selfResponse.data) {
        setSelfNickname(selfResponse.data.nickname);
        setSelfAvatarUrl(selfResponse.data.avatarUrl);
      }
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate('/chat', { replace: true });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !id) return;

    const tempId = Date.now();
    const newMessage: Message = {
      messageId: tempId, // 临时ID
      senderId: phone,
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
        // 确保返回的数据符合Message接口
        const serverMessage: Message = {
          messageId: response.data.messageId,
          senderId: response.data.senderId,
          receiverId: response.data.receiverId,
          content: response.data.content,
          type: response.data.type,
          status: 'sent',
          createdAt: response.data.createdAt
        };
        
        // 更新消息状态为已发送，使用服务器返回的消息
        setMessages(prev => 
          prev.map(msg => 
            msg.messageId === tempId ? serverMessage : msg
          )
        );
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      // 更新消息状态为发送失败
      setMessages(prev =>
        prev.map(msg =>
          msg.messageId === tempId
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
      <div className={styles.messageList} ref={messageListRef}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <>
            {messages.map(message => {
              const isSelf = message.senderId === phone;
              return (
                <div
                  key={message.messageId}
                  className={`${styles.messageItem} ${isSelf ? styles.self : ''}`}
                >
                  {!isSelf && <Avatar nickname={nickname} size={40} avatarUrl={avatarUrl} />}
                  {isSelf && <Avatar nickname={selfNickname} size={40} avatarUrl={selfAvatarUrl} />}
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