import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { requestOTP, verifyOTP } from '../controllers/twoFactorController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

export default router;
