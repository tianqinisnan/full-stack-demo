import { useEffect, useRef } from 'react';
import { socketService } from '@src/services/socket';
import { userStorage } from '@src/utils/storage';
import Toast from '@src/components/Toast';
import { eventBus, EVENT_NAMES } from '@src/utils/eventBus';

const SocketManager = () => {
  const isConnected = useRef(false);

  useEffect(() => {
    const phone = userStorage.getPhone();
    if (!phone || isConnected.current) return;

    isConnected.current = true;

    // 连接 WebSocket
    socketService.connect();

    // 监听新消息
    const unsubscribeMessage = socketService.onNewMessage((data) => {
      if (data.message.receiverId === phone) {
        Toast.show('新消息来了～');
      }
      eventBus.publish(EVENT_NAMES.NEW_MESSAGE, data.message);
    });

    // 监听消息已读状态
    const unsubscribeRead = socketService.onMessageRead((data) => {
      eventBus.publish(EVENT_NAMES.MESSAGE_READ, data);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeRead();
      isConnected.current = false;
    };
  }, []);

  return null;
};

export default SocketManager; 