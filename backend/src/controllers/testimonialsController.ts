import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';
import logger from '../utils/logger';

/**
 * @swagger
 * /testimonials:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get approved testimonials
 *     responses:
 *       200:
 *         description: List of testimonials
 */
export async function getTestimonials(_req: Request, res: Response): Promise<void> {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, message: 'Testimonials fetched', data: testimonials });
  } catch (error) {
    logger.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
}
