import express from 'express';
import { updateNickname, getUserInfo } from '../controllers/user';

const router = express.Router();

router.post('/update-nickname', updateNickname);
router.get('/info', getUserInfo);

export const userRoutes = router; 