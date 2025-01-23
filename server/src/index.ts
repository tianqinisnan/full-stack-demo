import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { connectDB } from './config/db';
import { verificationRoutes } from './routes/verification';
import { eventRoutes } from './routes/event';
import { userRoutes } from './routes/user';
import { chatRoutes } from './routes/chat';
import { uploadRoutes } from './routes/upload';
import { env } from './config/env';
import { initializeWebSocket } from './services/websocket';
import path from 'path';

// 连接数据库
connectDB().catch(err => {
  console.error('数据库连接失败，服务器无法启动:', err);
  process.exit(1);
});

const app = express();
const server = createServer(app);

// 初始化 WebSocket
initializeWebSocket(server);

// 中间件
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user-phone']
}));
app.use(morgan('dev'));
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(process.cwd(), 'public')));

// 路由
app.use('/api/verification', verificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

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

server.listen(env.server.port, () => {
  console.log(`服务器运行在 http://${env.server.host}:${env.server.port}`);
}); 