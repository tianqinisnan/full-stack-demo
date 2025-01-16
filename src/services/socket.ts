import { io, Socket } from 'socket.io-client';
import { env } from '../config/env';
import { userStorage } from '@src/utils/storage';

export enum EventType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  MESSAGE_READ = 'MESSAGE_READ'
}

interface NewMessageEvent {
  message: {
    messageId: number;
    senderId: string;
    receiverId: string;
    content: string;
    type: string;
    status: string;
    createdAt: string;
  };
  sender: {
    phone: string;
  };
}

interface MessageReadEvent {
  messageId: number;
  reader: {
    phone: string;
  };
}

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: Set<(data: NewMessageEvent) => void> = new Set();
  private readHandlers: Set<(data: MessageReadEvent) => void> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(env.api.baseURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // 连接成功后，加入房间
    this.socket.on('connect', () => {
      const phone = userStorage.getPhone();
      if (phone) {
        this.socket?.emit('join', phone);
      }
    });

    // 连接断开后，尝试重连
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected, attempting to reconnect...');
      this.scheduleReconnect();
    });

    // 监听新消息
    this.socket.on(EventType.NEW_MESSAGE, (data: NewMessageEvent) => {
      this.messageHandlers.forEach(handler => handler(data));
    });

    // 监听消息已读
    this.socket.on(EventType.MESSAGE_READ, (data: MessageReadEvent) => {
      this.readHandlers.forEach(handler => handler(data));
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 添加新消息处理器
  onNewMessage(handler: (data: NewMessageEvent) => void) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  // 添加消息已读处理器
  onMessageRead(handler: (data: MessageReadEvent) => void) {
    this.readHandlers.add(handler);
    return () => this.readHandlers.delete(handler);
  }
}

export const socketService = new SocketService(); 