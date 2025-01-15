import { Request, Response } from 'express';
import { Message, IMessage } from '../models/message';
import { Conversation } from '../models/conversation';
import { User } from '../models/User';

// 获取会话列表
export const getConversations = async (req: Request, res: Response) => {
  try {
    const { phone } = req.user!;
    
    // 获取所有会话
    const conversations = await Conversation.find({ userId: phone })
      .sort({ updatedAt: -1 })
      .lean();

    // 获取所有最后消息的ID
    const lastMessageIds = conversations
      .filter(conv => conv.lastMessage)
      .map(conv => conv.lastMessage);

    // 获取最后消息的详情
    const lastMessages = await Message.find(
      { messageId: { $in: lastMessageIds } }
    ).lean();
    const messageMap = new Map(lastMessages.map(msg => [msg.messageId, msg]));

    // 获取会话对象的用户信息
    const userIds = conversations.map(conv => conv.partnerId);
    const users = await User.find({ phone: { $in: userIds } }).lean();
    const userMap = new Map(users.map(user => [user.phone, user]));

    // 组装返回数据
    const result = conversations.map(conv => ({
      userId: conv.partnerId,
      nickname: userMap.get(conv.partnerId)?.nickname || '未知用户',
      avatarUrl: userMap.get(conv.partnerId)?.avatarUrl,
      lastMessage: conv.lastMessage ? messageMap.get(conv.lastMessage) : undefined,
      unreadCount: conv.unreadCount,
      updatedAt: conv.updatedAt
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ success: false, message: '获取会话列表失败' });
  }
};

// 获取与指定用户的聊天记录
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { phone } = req.user!;
    const { userId } = req.params;
    const { before } = req.query;

    const query: any = {
      $or: [
        { senderId: phone, receiverId: userId },
        { senderId: userId, receiverId: phone }
      ]
    };

    if (before) {
      query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    res.status(500).json({ success: false, message: '获取聊天记录失败' });
  }
};

// 发送消息
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { phone } = req.user!;
    const { receiverId, content, type = 'text' } = req.body;

    // 创建新消息
    const message = await Message.create({
      senderId: phone,
      receiverId,
      content,
      type,
      status: 'sent'
    });

    // 更新或创建会话
    await Conversation.findOneAndUpdate(
      { userId: phone, partnerId: receiverId },
      {
        lastMessage: message.messageId,
        $setOnInsert: { userId: phone, partnerId: receiverId }
      },
      { upsert: true, new: true }
    );

    // 更新接收方的会话
    await Conversation.findOneAndUpdate(
      { userId: receiverId, partnerId: phone },
      {
        lastMessage: message.messageId,
        $inc: { unreadCount: 1 },
        $setOnInsert: { userId: receiverId, partnerId: phone }
      },
      { upsert: true }
    );

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ success: false, message: '发送消息失败' });
  }
};

// 标记消息为已读
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { phone } = req.user!;
    const { messageId } = req.params;

    const message = await Message.findOne({ messageId: parseInt(messageId) });
    if (!message) {
      return res.status(404).json({ success: false, message: '消息不存在' });
    }

    // 只有消息接收者可以标记为已读
    if (message.receiverId !== phone) {
      return res.status(403).json({ success: false, message: '无权操作' });
    }

    // 更新消息状态
    await Message.findOneAndUpdate(
      { messageId: parseInt(messageId) },
      { status: 'read' }
    );

    // 更新会话的未读消息计数
    await Conversation.findOneAndUpdate(
      { userId: phone, partnerId: message.senderId },
      { unreadCount: 0 }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('标记消息已读失败:', error);
    res.status(500).json({ success: false, message: '标记消息已读失败' });
  }
};

// 创建或获取会话
export const createOrGetConversation = async (req: Request, res: Response) => {
  try {
    const { phone } = req.user!;
    const { partnerId } = req.body;

    // 检查用户是否存在
    const partner = await User.findOne({ phone: partnerId });
    if (!partner) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 尝试查找现有会话或创建新会话
    const conversation = await Conversation.findOneAndUpdate(
      { userId: phone, partnerId: partnerId },
      { $setOnInsert: { unreadCount: 0 } },
      { upsert: true, new: true }
    ).lean();

    // 获取最后一条消息（如果存在）
    let lastMessage = undefined;
    if (conversation.lastMessage) {
      const foundMessage = await Message.findOne({ 
        messageId: conversation.lastMessage 
      }).lean();
      if (foundMessage) {
        lastMessage = foundMessage;
      }
    }

    // 获取会话对象的用户信息
    const result = {
      userId: conversation.partnerId,
      nickname: partner.nickname || '未知用户',
      avatarUrl: partner.avatarUrl,
      lastMessage,
      unreadCount: conversation.unreadCount,
      updatedAt: conversation.updatedAt
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('创建会话失败:', error);
    res.status(500).json({ success: false, message: '创建会话失败' });
  }
}; 