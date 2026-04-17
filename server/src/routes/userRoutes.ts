import express from 'express';
import { signup, login, getUsers, inviteUser } from '../controllers/userController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.use(protect);

router.get('/', adminOnly, getUsers);
router.post('/invite', adminOnly, inviteUser);

export default router;
