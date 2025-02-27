import express from 'express';
import { updateNickname, updateAvatar, getUserInfo, getAllUsers } from '../controllers/user';
import { auth } from '../middleware/auth';

const router = express.Router();

// 所有用户相关的路由都需要登录
router.use(auth);

router.post('/update-nickname', updateNickname);
router.post('/update-avatar', updateAvatar);
router.get('/info', getUserInfo);
router.get('/all', getAllUsers);

export const userRoutes = router; 