import { Request, Response } from 'express';
import { User } from '../models/User';
import { isValidPhone, isValidVerificationCode } from '../utils/validators';

// 存储验证码的临时对象（实际应用中应该使用 Redis 等数据库）
const verificationCodes: { [key: string]: string } = {};

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // 验证手机号格式
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: '无效的手机号码' });
    }

    try {
      // 查找或创建用户（这里的 phone 已经通过验证，Model 的验证会自动通过）
      let user = await User.findOne({ phone });
      
      if (!user) {
        user = await User.create({ phone });
        console.log('新用户已创建:', phone);
      } else {
        console.log('已存在的用户:', phone);
      }

      // 生成6位随机验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 存储验证码（实际应用中应该设置过期时间）
      verificationCodes[phone] = code;

      // 这里应该调用短信服务发送验证码
      console.log(`向手机号 ${phone} 发送验证码: ${code}`);

      res.json({ 
        message: '验证码发送成功',
        // 实际生产环境不应该返回验证码
        code: code 
      });
    } catch (dbError) {
      // 数据库操作错误（例如唯一性约束冲突）
      console.error('数据库操作错误:', dbError);
      res.status(500).json({ message: '用户创建失败' });
    }
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({ 
      message: '发送验证码失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
};

export const verifyCode = (req: Request, res: Response) => {
  const { phone, code } = req.body;

  // 验证输入
  if (!phone || !code) {
    return res.status(400).json({ message: '手机号和验证码不能为空' });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: '无效的手机号码' });
  }

  if (!isValidVerificationCode(code)) {
    return res.status(400).json({ message: '无效的验证码格式' });
  }

  const storedCode = verificationCodes[phone];

  if (!storedCode) {
    return res.status(400).json({ message: '请先获取验证码' });
  }

  if (code !== storedCode) {
    return res.status(400).json({ message: '验证码错误' });
  }

  // 验证成功后删除存储的验证码
  delete verificationCodes[phone];

  res.json({ message: '验证成功' });
}; 