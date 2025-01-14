import express from 'express';
import { updateNickname, getUserInfo, getAllUsers } from '../controllers/user';

const router = express.Router();

router.post('/update-nickname', updateNickname);
router.get('/info', getUserInfo);
router.get('/all', getAllUsers);

export const userRoutes = router; 