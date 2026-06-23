import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Testimonial from '../models/Testimonial';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const CACHE_TTL = 6 * 60 * 60;

export const listTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminMode = req.query['admin'] === 'true';
    const cacheKey = `testimonials:list:${adminMode}`;

    if (!adminMode) {
      const cached = await cacheGet(cacheKey);
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    }

    const filter = adminMode ? {} : { approved: true };
    const testimonials = await Testimonial.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    const response = { success: true, data: testimonials, message: 'Testimonials retrieved' };
    if (!adminMode) await cacheSet(cacheKey, JSON.stringify(response), CACHE_TTL);
    res.json(response);
  } catch (error) {
    logger.error('List testimonials error:', error);
    sendError(res, 'Failed to retrieve testimonials', 500);
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const testimonial = await Testimonial.create(req.body);
    sendSuccess(res, testimonial, 'Testimonial submitted for review', 201);
  } catch (error) {
    logger.error('Create testimonial error:', error);
    sendError(res, 'Failed to submit testimonial', 500);
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params['id'], req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      sendError(res, 'Testimonial not found', 404);
      return;
    }
    await cacheDel('testimonials:list:false');
    sendSuccess(res, testimonial, 'Testimonial updated');
  } catch (error) {
    logger.error('Update testimonial error:', error);
    sendError(res, 'Failed to update testimonial', 500);
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params['id']);
    if (!testimonial) {
      sendError(res, 'Testimonial not found', 404);
      return;
    }
    await cacheDel('testimonials:list:false');
    sendSuccess(res, null, 'Testimonial deleted');
  } catch (error) {
    logger.error('Delete testimonial error:', error);
    sendError(res, 'Failed to delete testimonial', 500);
  }
};

export const approveTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params['id'],
      { approved: true },
      { new: true }
    );
    if (!testimonial) {
      sendError(res, 'Testimonial not found', 404);
      return;
    }
    await cacheDel('testimonials:list:false');
    sendSuccess(res, testimonial, 'Testimonial approved');
  } catch (error) {
    logger.error('Approve testimonial error:', error);
    sendError(res, 'Failed to approve testimonial', 500);
  }
};
