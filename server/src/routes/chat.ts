import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessageAsRead,
  createOrGetConversation
} from '../controllers/chat';

const router = Router();

// 所有聊天相关的路由都需要登录
router.use(auth);

// 获取会话列表
router.get('/conversations', getConversations);

// 获取与指定用户的聊天记录
router.get('/messages/:userId', getMessages);

// 发送消息
router.post('/messages', sendMessage);

// 标记消息为已读
router.post('/messages/:messageId/read', markMessageAsRead);

// 创建或获取会话
router.post('/conversations', createOrGetConversation);

export const chatRoutes = router; 