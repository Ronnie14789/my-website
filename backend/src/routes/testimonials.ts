import { Router } from 'express';
import { getTestimonials } from '../controllers/testimonialsController';

const router = Router();

router.get('/', getTestimonials);

export default router;
