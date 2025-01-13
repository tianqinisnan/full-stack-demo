import { Request, Response } from 'express';
import { User } from '../models/User';
import { isValidPhone, isValidVerificationCode } from '../utils/validators';

// 验证码存储（实际项目中应该使用 Redis）
const verificationCodes: { [key: string]: string } = {};

// 生成验证码
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送验证码
export const sendCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ message: '无效的手机号' });
      return;
    }

    const code = generateCode();
    verificationCodes[phone] = code;

    // TODO: 实际发送验证码的逻辑
    console.log(`验证码已发送到 ${phone}: ${code}`);

    res.json({ success: true });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({ message: '发送验证码失败' });
  }
};

// 验证验证码
export const verifyCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      res.status(400).json({ message: '手机号和验证码不能为空' });
      return;
    }

    if (!isValidPhone(phone)) {
      res.status(400).json({ message: '无效的手机号' });
      return;
    }

    if (!isValidVerificationCode(code)) {
      res.status(400).json({ message: '无效的验证码格式' });
      return;
    }

    const savedCode = verificationCodes[phone];
    if (!savedCode || savedCode !== code) {
      res.status(400).json({ message: '验证码错误' });
      return;
    }

    // 验证成功后删除验证码
    delete verificationCodes[phone];

    // 检查用户是否存在
    let user = await User.findOne({ phone });
    const isNewUser = !user;

    // 如果是新用户，创建用户记录
    if (isNewUser) {
      user = await User.create({
        phone,
        status: 'active',
        lastLoginAt: new Date()
      });
    } else {
      // 更新最后登录时间
      await User.updateOne(
        { phone },
        { lastLoginAt: new Date() }
      );
    }

    // 确保在这里 user 一定存在（要么是查询到的，要么是新创建的）
    if (!user) {
      res.status(500).json({ message: '用户创建失败' });
      return;
    }

    res.json({
      success: true,
      data: {
        isNewUser,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('验证失败:', error);
    res.status(500).json({ message: '验证失败' });
  }
}; 