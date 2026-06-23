import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import NewsletterSubscription from '../models/NewsletterSubscription';
import { emailService } from '../services/emailService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const { email, name } = req.body;

    const existing = await NewsletterSubscription.findOne({ email: { $eq: email } });

    if (existing) {
      if (existing.status === 'active') {
        sendError(res, 'This email is already subscribed', 409);
        return;
      }
      existing.status = 'active';
      existing.name = name;
      await existing.save();

      emailService
        .sendNewsletterConfirmation({
          email,
          name,
          unsubscribeToken: existing.unsubscribeToken,
        })
        .catch(() => undefined);

      sendSuccess(res, { id: existing._id }, 'Welcome back! You have been resubscribed.', 200);
      return;
    }

    const subscription = await NewsletterSubscription.create({ email, name });

    emailService
      .sendNewsletterConfirmation({
        email,
        name,
        unsubscribeToken: subscription.unsubscribeToken,
      })
      .catch(() => undefined);

    sendSuccess(res, { id: subscription._id }, 'Successfully subscribed to the newsletter!', 201);
  } catch (error) {
    logger.error('Newsletter subscribe error:', error);
    sendError(res, 'Failed to subscribe', 500);
  }
};

export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      sendError(res, 'Invalid unsubscribe token', 400);
      return;
    }

    const subscription = await NewsletterSubscription.findOne({ unsubscribeToken: token });

    if (!subscription) {
      sendError(res, 'Invalid or expired unsubscribe link', 404);
      return;
    }

    subscription.status = 'unsubscribed';
    await subscription.save();

    sendSuccess(res, null, 'You have been successfully unsubscribed');
  } catch (error) {
    logger.error('Unsubscribe error:', error);
    sendError(res, 'Failed to unsubscribe', 500);
  }
};

export const listSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query['page'] as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query['limit'] as string) || '20', 10)));
    const status = req.query['status'] as string;

    const VALID_SUB_STATUSES = ['active', 'unsubscribed', 'bounced'] as const;
    const filter: Record<string, unknown> = {};
    if (status && VALID_SUB_STATUSES.includes(status as (typeof VALID_SUB_STATUSES)[number])) {
      filter['status'] = { $eq: status };
    }

    const [subscribers, total] = await Promise.all([
      NewsletterSubscription.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v')
        .lean(),
      NewsletterSubscription.countDocuments(filter),
    ]);

    sendSuccess(res, subscribers, 'Subscribers retrieved', 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error('List subscribers error:', error);
    sendError(res, 'Failed to retrieve subscribers', 500);
  }
};

export const deleteSubscriber = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscriber = await NewsletterSubscription.findByIdAndDelete(req.params['id']);
    if (!subscriber) {
      sendError(res, 'Subscriber not found', 404);
      return;
    }
    sendSuccess(res, null, 'Subscriber deleted');
  } catch (error) {
    logger.error('Delete subscriber error:', error);
    sendError(res, 'Failed to delete subscriber', 500);
  }
};
