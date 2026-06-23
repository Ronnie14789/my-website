import { Router } from 'express';
import { body } from 'express-validator';
import { contactLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';
import { submitContact, listContacts, updateContactStatus } from '../controllers/contactController';

const router = Router();

const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
];

router.post('/', contactLimiter, contactValidation, submitContact);
router.get('/', authenticate, listContacts);
router.patch('/:id/status', authenticate, updateContactStatus);

export default router;
