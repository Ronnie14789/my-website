import { Router } from 'express';
import { body } from 'express-validator';
import { getSession, login } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email address required'),
    body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password is required'),
  ],
  validateRequest,
  login,
);

router.get('/me', authenticate, getSession);

export default router;
