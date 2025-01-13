import express from 'express';
import { sendCode, verifyCode } from '../controllers/verification';

const router = express.Router();

// 发送验证码
router.post('/send-code', sendCode);

// 验证验证码
router.post('/verify-code', verifyCode);

export const verificationRoutes = router;