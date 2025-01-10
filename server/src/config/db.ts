import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async () => {
  try {
    console.log('正在连接到 MongoDB...');
    console.log('连接 URI:', env.mongodb.uri);
    
    const conn = await mongoose.connect(env.mongodb.uri);
    console.log(`MongoDB 连接成功: ${conn.connection.host}:${conn.connection.port}`);
    
    // 监听连接错误事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
    });

    // 监听断开连接事件
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB 连接断开');
    });

  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
}; 