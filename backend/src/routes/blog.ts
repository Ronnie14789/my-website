import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', getPosts);
router.post(
  '/',
  authenticate,
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3–200 characters'),
    body('slug').trim().isLength({ min: 3, max: 200 }).withMessage('Slug must be 3–200 characters'),
    body('excerpt')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Excerpt must be 10–500 characters'),
    body('content')
      .trim()
      .isLength({ min: 50 })
      .withMessage('Content must be at least 50 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('published').optional().isBoolean().withMessage('Published must be a boolean'),
  ],
  validateRequest,
  createPost,
);
router.patch(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().isLength({ min: 3, max: 200 }),
    body('slug').optional().trim().isLength({ min: 3, max: 200 }),
    body('excerpt').optional().trim().isLength({ min: 10, max: 500 }),
    body('content').optional().trim().isLength({ min: 50 }),
    body('tags').optional().isArray(),
    body('published').optional().isBoolean(),
  ],
  validateRequest,
  updatePost,
);
router.delete('/:id', authenticate, deletePost);
router.get('/:slug', getPostBySlug);

export default router;
