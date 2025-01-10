import express from 'express';
import { trackEvent, getEvents } from '../controllers/event';
import { validateAppId } from '../middleware/validateAppId';

const router = express.Router();

// 记录埋点事件
router.post('/track', validateAppId, trackEvent);

// 获取埋点事件列表
router.get('/list', validateAppId, getEvents);

export const eventRoutes = router;