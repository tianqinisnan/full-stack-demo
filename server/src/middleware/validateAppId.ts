import { Request, Response, NextFunction } from 'express';

// 允许的 appId 列表
const ALLOWED_APP_IDS = ['xxx_dev'];

export const validateAppId = (req: Request, res: Response, next: NextFunction) => {
  const appId = req.query.appId as string || (req.body[0]?.app_id as string);

  if (!appId) {
    return res.status(400).json({
      success: false,
      message: '缺少 appId 参数'
    });
  }

  if (!ALLOWED_APP_IDS.includes(appId)) {
    return res.status(403).json({
      success: false,
      message: '无效的 appId'
    });
  }

  next();
}; 