import { Request, Response } from 'express';
import { User } from '../models/User';

// 生成默认昵称
const generateDefaultNickname = (phone: string): string => {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
};

// 更新用户昵称
export const updateNickname = async (req: Request, res: Response) => {
  const { phone, nickname } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    user.nickname = nickname;
    await user.save();

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新昵称失败'
    });
  }
};

// 获取用户信息
export const getUserInfo = async (req: Request, res: Response) => {
  const { phone } = req.query;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        nickname: user.nickname
      }
    });
  } catch (error) {
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