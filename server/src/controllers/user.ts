import { Request, Response } from 'express';
import { User } from '../models/User';
import { History } from '../models/History';
import { getNextSequence } from '../models/counter';

// 生成默认昵称
const generateDefaultNickname = (phone: string): string => {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
};

// 更新用户昵称
export const updateNickname = async (req: Request, res: Response) => {
  const phone = req.header('x-user-phone');
  const { nickname } = req.body;

  if (!phone) {
    return res.status(401).json({
      success: false,
      message: '未登录'
    });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 处理历史记录
    let history;
    if (user.historyId) {
      history = await History.findOne({ historyId: user.historyId });
      if (history && user.nickname) {
        await history.addNicknameHistory(user.nickname);
      }
    } else {
      // 创建新的历史记录
      const historyId = await getNextSequence('history_id');
      history = await History.create({
        historyId,
        userId: user._id,
        nicknames: user.nickname ? [{ value: user.nickname }] : [],
        avatars: []
      });
      user.historyId = historyId;
    }

    // 更新用户昵称
    user.nickname = nickname;
    await user.save();

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Update nickname error:', error);
    res.status(500).json({
      success: false,
      message: '更新昵称失败'
    });
  }
};

// 获取用户信息
export const getUserInfo = async (req: Request, res: Response) => {
  // 优先从 query 获取手机号（查询指定用户），如果没有则从 header 获取（当前登录用户）
  const phone = (req.query.phone as string) || req.header('x-user-phone');

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 如果是查询当前登录用户，同时返回历史记录
    const isCurrentUser = phone === req.header('x-user-phone');
    let historyData;
    
    if (isCurrentUser && user.historyId) {
      const history = await History.findOne({ historyId: user.historyId });
      if (history) {
        historyData = {
          nicknames: history.nicknames,
          avatars: history.avatars
        };
      }
    }

    res.json({
      success: true,
      data: {
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        ...(historyData && { history: historyData })
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
};

// 获取所有用户信息
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, { phone: 1, nickname: 1, avatarUrl: 1, _id: 0 });
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
    });
  }
};

// 更新用户头像
export const updateAvatar = async (req: Request, res: Response) => {
  const phone = req.header('x-user-phone');
  const { avatarUrl } = req.body;

  if (!phone) {
    return res.status(401).json({
      success: false,
      message: '未登录'
    });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 处理历史记录
    let history;
    if (user.historyId) {
      history = await History.findOne({ historyId: user.historyId });
      if (history && user.avatarUrl) {
        await history.addAvatarHistory(user.avatarUrl);
      }
    } else {
      // 创建新的历史记录
      const historyId = await getNextSequence('history_id');
      history = await History.create({
        historyId,
        userId: user._id,
        avatars: user.avatarUrl ? [{ url: user.avatarUrl }] : [],
        nicknames: []
      });
      user.historyId = historyId;
    }

    // 更新用户头像
    user.avatarUrl = avatarUrl;
    await user.save();

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: '更新头像失败'
    });
  }
}; 