import dotenv from 'dotenv';
import path from 'path';

// 加载根目录的 .env 文件
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const MONGODB_HOST = process.env.MONGODB_HOST || '127.0.0.1';
const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'dev_user_analytics';

export const env = {
  server: {
    port: process.env.SERVER_PORT || '8888',
    host: process.env.SERVER_HOST || 'localhost',
  },
  mongodb: {
    port: MONGODB_PORT,
    host: MONGODB_HOST,
    database: MONGODB_DATABASE,
    // 动态生成 MongoDB URI
    get uri() {
      return `mongodb://${this.host}:${this.port}/${this.database}`;
    }
  }
}; 