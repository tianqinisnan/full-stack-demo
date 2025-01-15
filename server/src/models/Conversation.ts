import { Schema, model, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: string;
  partnerId: string;
  lastMessage?: number;
  unreadCount: number;
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true },
    partnerId: { type: String, required: true },
    lastMessage: { type: Number, ref: 'Message' },
    unreadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 创建复合索引以优化查询性能
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, partnerId: 1 }, { unique: true });

export const Conversation = model<IConversation>('Conversation', conversationSchema); 