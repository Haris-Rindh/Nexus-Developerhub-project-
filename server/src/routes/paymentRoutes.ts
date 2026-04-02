import express from 'express';
import { 
  processDeposit, 
  processWithdrawal, 
  processTransfer, 
  getTransactionHistory 
} from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/payments/deposit:
 * post:
 * summary: Process a deposit (Mock)
 * tags: [Payments]
 */
router.post('/deposit', protect, processDeposit);

/**
 * @swagger
 * /api/payments/withdraw:
 * post:
 * summary: Process a withdrawal (Mock)
 * tags: [Payments]
 */
router.post('/withdraw', protect, processWithdrawal);

/**
 * @swagger
 * /api/payments/transfer:
 * post:
 * summary: Transfer funds to another user (Mock)
 * tags: [Payments]
 */
router.post('/transfer', protect, processTransfer);

/**
 * @swagger
 * /api/payments/history:
 * get:
 * summary: Get user transaction history
 * tags: [Payments]
 */
router.get('/history', protect, getTransactionHistory);

export default router;