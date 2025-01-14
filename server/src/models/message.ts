import { Schema, model } from 'mongoose';

export interface IMessage {
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image';
  status: 'sending' | 'sent' | 'read' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    status: {
      type: String,
      enum: ['sending', 'sent', 'read', 'failed'],
      default: 'sent'
    }
  },
  { timestamps: true }
);

// 创建复合索引以优化查询性能
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, status: 1 });

export const Message = model<IMessage>('Message', messageSchema); 