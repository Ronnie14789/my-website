import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

const router = Router();

const projectValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title required'),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('shortDescription').trim().isLength({ max: 300 }).withMessage('Short description max 300 chars'),
  body('status').optional().isIn(['active', 'completed', 'archived']).withMessage('Invalid status'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be non-negative integer'),
];

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', authenticate, projectValidation, createProject);
router.put('/:id', authenticate, projectValidation, updateProject);
router.delete('/:id', authenticate, deleteProject);

export default router;
