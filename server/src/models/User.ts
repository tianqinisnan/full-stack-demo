import mongoose from 'mongoose';
import { PHONE_REGEX } from '../utils/validators';

// 用户模型接口
export interface IUser extends mongoose.Document {
  phone: string;
  nickname?: string;
  avatar?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'blocked';
  lastLoginAt?: Date;
  historyId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 用户模型 Schema
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v: string) {
        return PHONE_REGEX.test(v);
      },
      message: '请输入有效的手机号码'
    }
  },
  nickname: {
    type: String,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    trim: true
  },
  avatarUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  lastLoginAt: {
    type: Date
  },
  historyId: {
    type: Number
  }
}, {
  timestamps: true, // 自动管理 createdAt 和 updatedAt
  collection: 'users_info' // 指定集合名称
});

// 更新时自动更新 updatedAt 字段
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建并导出用户模型
export const User = mongoose.model<IUser>('User', userSchema); 