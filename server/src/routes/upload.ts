import express from 'express';
import { upload, uploadImage } from '../controllers/upload';

const router = express.Router();

// 上传图片
// @ts-ignore: multer 类型定义问题
router.post('/image', upload.single('image'), uploadImage);

export const uploadRoutes = router; 