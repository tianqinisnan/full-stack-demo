import { Schema, model, Types } from 'mongoose';
import { IMessage } from './message';

export interface IConversation {
  userId: string;
  partnerId: string;
  lastMessage?: Types.ObjectId | IMessage;
  unreadCount: number;
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true },
    partnerId: { type: String, required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    unreadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 创建复合索引以优化查询性能
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, partnerId: 1 }, { unique: true });

export const Conversation = model<IConversation>('Conversation', conversationSchema); 