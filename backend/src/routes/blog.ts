import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  incrementViews,
} from '../controllers/blogController';

const router = Router();

const postValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('slug').optional().trim().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with hyphens'),
  body('excerpt').trim().isLength({ min: 10, max: 500 }).withMessage('Excerpt must be 10-500 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
];

router.get('/', listPosts);
router.get('/:slug', getPost);
router.post('/:id/views', incrementViews);
router.post('/', authenticate, postValidation, createPost);
router.put('/:id', authenticate, postValidation, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
