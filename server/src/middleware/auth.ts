import { Request, Response, NextFunction } from 'express';

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        phone: string;
      };
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const phone = req.headers['x-user-phone'];

  if (!phone || typeof phone !== 'string') {
    return res.status(401).json({ success: false, message: '未登录' });
  }

  req.user = { phone };
  next();
}; 