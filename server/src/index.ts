import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { verificationRoutes } from './routes/verification';
import { eventRoutes } from './routes/event';
import { userRoutes } from './routes/user';
import { chatRoutes } from './routes/chat';
import { env } from './config/env';

// 连接数据库
connectDB().catch(err => {
  console.error('数据库连接失败，服务器无法启动:', err);
  process.exit(1);
});

const app = express();

// 中间件
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user-phone']
}));
app.use(morgan('dev'));
app.use(express.json());

// 路由
app.use('/api/verification', verificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

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