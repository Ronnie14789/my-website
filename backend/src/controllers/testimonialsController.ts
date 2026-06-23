import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';
import logger from '../utils/logger';
import { sanitizeOptionalString, sanitizeString } from '../utils/sanitize';

interface TestimonialBody {
  name?: string;
  role?: string;
  company?: string;
  message?: string;
  rating?: number;
  avatarUrl?: string;
  approved?: boolean;
}

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

export async function getAllTestimonials(_req: Request, res: Response): Promise<void> {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, message: 'Testimonials fetched.', data: testimonials });
  } catch (error) {
    logger.error('Get all testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials.' });
  }
}

export async function createTestimonial(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as TestimonialBody;
    const testimonial = await Testimonial.create({
      name: sanitizeString(String(body.name)),
      role: sanitizeString(String(body.role)),
      company: sanitizeString(String(body.company)),
      message: sanitizeString(String(body.message)),
      rating: Number(body.rating),
      avatarUrl: sanitizeOptionalString(body.avatarUrl),
      approved: body.approved === true,
    });

    res.status(201).json({ success: true, message: 'Testimonial created.', data: testimonial });
  } catch (error) {
    logger.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to create testimonial.' });
  }
}

export async function updateTestimonial(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as TestimonialBody;
    const update: Record<string, unknown> = {};

    if (body.name !== undefined) update.name = sanitizeString(body.name);
    if (body.role !== undefined) update.role = sanitizeString(body.role);
    if (body.company !== undefined) update.company = sanitizeString(body.company);
    if (body.message !== undefined) update.message = sanitizeString(body.message);
    if (body.rating !== undefined) update.rating = Number(body.rating);
    if (body.avatarUrl !== undefined) update.avatarUrl = sanitizeOptionalString(body.avatarUrl);
    if (body.approved !== undefined) update.approved = body.approved === true;

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return;
    }

    res.json({ success: true, message: 'Testimonial updated.', data: testimonial });
  } catch (error) {
    logger.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to update testimonial.' });
  }
}

export async function deleteTestimonial(req: Request, res: Response): Promise<void> {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return;
    }

    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (error) {
    logger.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete testimonial.' });
  }
}
