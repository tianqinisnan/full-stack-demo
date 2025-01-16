// WebSocket 事件类型定义
export enum EventType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  MESSAGE_READ = 'MESSAGE_READ'
}

// 新消息事件数据结构
export interface NewMessageEvent {
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

// 消息已读事件数据结构
export interface MessageReadEvent {
  messageId: number;
  reader: {
    phone: string;
  };
} 