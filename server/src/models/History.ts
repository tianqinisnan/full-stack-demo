import { Schema, model, Document } from 'mongoose';
import { getNextSequence } from './counter';

const MAX_HISTORY_ITEMS = 5;

interface IHistory extends Document {
  historyId: number;
  userId: Schema.Types.ObjectId;
  nicknames: Array<{
    value: string;
    updatedAt: Date;
  }>;
  avatars: Array<{
    url: string;
    updatedAt: Date;
  }>;
  addNicknameHistory(nickname: string): Promise<void>;
  addAvatarHistory(avatarUrl: string): Promise<void>;
}

const historySchema = new Schema<IHistory>({
  historyId: { type: Number, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nicknames: [{
    value: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
  }],
  avatars: [{
    url: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
  }]
});

// 添加新的昵称历史记录
historySchema.methods.addNicknameHistory = async function(nickname: string) {
  this.nicknames.push({
    value: nickname,
    updatedAt: new Date()
  });

  // 保持最多 MAX_HISTORY_ITEMS 条记录
  if (this.nicknames.length > MAX_HISTORY_ITEMS) {
    this.nicknames = this.nicknames.slice(-MAX_HISTORY_ITEMS);
  }

  await this.save();
};

// 添加新的头像历史记录
historySchema.methods.addAvatarHistory = async function(avatarUrl: string) {
  this.avatars.push({
    url: avatarUrl,
    updatedAt: new Date()
  });

  // 保持最多 MAX_HISTORY_ITEMS 条记录
  if (this.avatars.length > MAX_HISTORY_ITEMS) {
    this.avatars = this.avatars.slice(-MAX_HISTORY_ITEMS);
  }

  await this.save();
};

// 在创建新记录前自动生成 historyId，设置 { validateBeforeSave: false } 以避免验证错误
historySchema.pre('save', { document: true, query: false }, async function(next) {
  if (this.isNew && !this.historyId) {
    this.historyId = await getNextSequence('history_id');
  }
  next();
});

export const History = model<IHistory>('History', historySchema); 