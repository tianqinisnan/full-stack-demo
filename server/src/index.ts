import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { verificationRoutes } from './routes/verification';
import { eventRoutes } from './routes/event';
import { env } from './config/env';

// 连接数据库
connectDB().catch(err => {
  console.error('数据库连接失败，服务器无法启动:', err);
  process.exit(1);
});

const app = express();

// 中间件
app.use(cors({
  origin: function(origin, callback) {
    // 允许没有origin的请求（比如同源请求）
    if (!origin) {
      return callback(null, true);
    }
    // 使用正则表达式匹配所有localhost域名（http和https）
    const localhostRegex = /^https?:\/\/localhost(:\d+)?$/;
    if (localhostRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的来源'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());

// 路由
app.use('/api/verification', verificationRoutes);
app.use('/api/events', eventRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 优雅关闭
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB 连接已关闭');
    process.exit(0);
  } catch (err) {
    console.error('关闭 MongoDB 连接时出错:', err);
    process.exit(1);
  }
});

app.listen(env.server.port, () => {
  console.log(`服务器运行在 http://${env.server.host}:${env.server.port}`);
}); 