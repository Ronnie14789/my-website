import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', getProjects);
router.post(
  '/',
  authenticate,
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3–200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be 10–1000 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
    body('order').optional().isNumeric().withMessage('Order must be numeric'),
    body('status')
      .optional()
      .isIn(['active', 'completed', 'archived'])
      .withMessage('Invalid project status'),
  ],
  validateRequest,
  createProject,
);
router.patch(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().isLength({ min: 3, max: 200 }),
    body('description').optional().trim().isLength({ min: 10, max: 1000 }),
    body('tags').optional().isArray(),
    body('featured').optional().isBoolean(),
    body('order').optional().isNumeric(),
    body('status').optional().isIn(['active', 'completed', 'archived']),
  ],
  validateRequest,
  updateProject,
);
router.delete('/:id', authenticate, deleteProject);
router.get('/:id', getProjectById);

export default router;
