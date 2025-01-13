import { Request, Response } from 'express';
import { User } from '../models/User';

// 生成默认昵称
const generateDefaultNickname = (phone: string): string => {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
};

// 更新用户昵称
export const updateNickname = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, nickname } = req.body;

    if (!phone || !nickname) {
      res.status(400).json({ message: '手机号和昵称不能为空' });
      return;
    }

    const user = await User.findOneAndUpdate(
      { phone },
      { nickname },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    res.json({ success: true, data: { nickname: user.nickname } });
  } catch (error) {
    console.error('更新昵称失败:', error);
    res.status(500).json({ message: '更新昵称失败' });
  }
};

// 获取用户信息
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.query;

    if (!phone) {
      res.status(400).json({ message: '手机号不能为空' });
      return;
    }

    let user = await User.findOne({ phone });

    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    // 如果用户没有昵称，生成默认昵称并保存
    if (!user.nickname) {
      const defaultNickname = generateDefaultNickname(phone as string);
      user = await User.findOneAndUpdate(
        { phone },
        { nickname: defaultNickname },
        { new: true }
      );
    }

    res.json({
      success: true,
      data: {
        nickname: user?.nickname,
        avatar: user?.avatar,
        status: user?.status
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
}; 