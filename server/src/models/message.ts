import { Schema, model } from 'mongoose';
import { getNextSequence } from './counter';

export interface IMessage {
  messageId: number;
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
    messageId: { type: Number, unique: true },
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

// 在保存前获取自增ID
messageSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.messageId = await getNextSequence('messages.messageId');
  }
  next();
});

// 创建复合索引以优化查询性能
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, status: 1 });
messageSchema.index({ messageId: 1 }, { unique: true });

export const Message = model<IMessage>('Message', messageSchema); 