import { Request, Response } from 'express';
import NewsletterSubscription from '../models/NewsletterSubscription';
import logger from '../utils/logger';
import { sanitizeString } from '../utils/sanitize';

/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     tags: [Newsletter]
 *     summary: Subscribe to newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Subscribed (or already subscribed)
 *       201:
 *         description: Successfully subscribed
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
export async function subscribe(req: Request, res: Response): Promise<void> {
  try {
    const email =
      typeof req.body.email === 'string' ? sanitizeString(req.body.email).toLowerCase() : '';

    if (!email) {
      res.status(400).json({ success: false, message: 'Valid email is required' });
      return;
    }

    const existing = await NewsletterSubscription.findOne({ email: { $eq: email } });

    if (existing) {
      if (existing.active) {
        res.json({ success: true, message: 'You are already subscribed!' });
        return;
      }
      // Re-subscribe
      existing.active = true;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      await existing.save();
      res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      return;
    }

    await NewsletterSubscription.create({ email, ipAddress: req.ip });
    logger.info(`New newsletter subscription: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to my newsletter!',
    });
  } catch (error) {
    logger.error('Newsletter subscribe error:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
}

/**
 * @swagger
 * /newsletter/unsubscribe:
 *   post:
 *     tags: [Newsletter]
 *     summary: Unsubscribe from newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Unsubscribed
 */
export async function unsubscribe(req: Request, res: Response): Promise<void> {
  try {
    const email =
      typeof req.body.email === 'string' ? sanitizeString(req.body.email).toLowerCase() : '';

    if (!email) {
      res.status(400).json({ success: false, message: 'Valid email is required' });
      return;
    }

    const subscription = await NewsletterSubscription.findOne({ email: { $eq: email } });

    if (!subscription || !subscription.active) {
      res.json({ success: true, message: 'Email not found in our list.' });
      return;
    }

    subscription.active = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (error) {
    logger.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
}

export async function listSubscribers(req: Request, res: Response): Promise<void> {
  try {
    const query = typeof req.query.q === 'string' ? sanitizeString(req.query.q).toLowerCase() : '';
    const status = typeof req.query.status === 'string' ? req.query.status : 'all';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const filter: Record<string, unknown> = {};
    if (query) {
      filter.email = { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }
    if (status === 'active') {
      filter.active = true;
    }
    if (status === 'inactive') {
      filter.active = false;
    }

    const skip = (page - 1) * limit;
    const [subscribers, total] = await Promise.all([
      NewsletterSubscription.find(filter).sort({ subscribedAt: -1 }).skip(skip).limit(limit),
      NewsletterSubscription.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Subscribers fetched.',
      data: {
        subscribers,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('List subscribers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers.' });
  }
}

export async function updateSubscriberStatus(req: Request, res: Response): Promise<void> {
  try {
    const active = req.body.active === true;
    const subscriber = await NewsletterSubscription.findById(req.params.id);

    if (!subscriber) {
      res.status(404).json({ success: false, message: 'Subscriber not found.' });
      return;
    }

    subscriber.active = active;
    subscriber.unsubscribedAt = active ? undefined : new Date();
    if (active) {
      subscriber.subscribedAt = new Date();
    }
    await subscriber.save();

    res.json({
      success: true,
      message: 'Subscriber updated.',
      data: subscriber,
    });
  } catch (error) {
    logger.error('Update subscriber status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update subscriber.' });
  }
}

export async function exportSubscribersCsv(req: Request, res: Response): Promise<void> {
  try {
    const query = typeof req.query.q === 'string' ? sanitizeString(req.query.q).toLowerCase() : '';
    const status = typeof req.query.status === 'string' ? req.query.status : 'all';

    const filter: Record<string, unknown> = {};
    if (query) {
      filter.email = { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }
    if (status === 'active') {
      filter.active = true;
    }
    if (status === 'inactive') {
      filter.active = false;
    }

    const subscribers = await NewsletterSubscription.find(filter).sort({ subscribedAt: -1 });

    const csvRows = [
      'email,active,subscribedAt,unsubscribedAt',
      ...subscribers.map((subscriber) =>
        [
          subscriber.email,
          subscriber.active ? 'true' : 'false',
          subscriber.subscribedAt.toISOString(),
          subscriber.unsubscribedAt?.toISOString() ?? '',
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"');
    res.send(csvRows.join('\n'));
  } catch (error) {
    logger.error('Export subscribers csv error:', error);
    res.status(500).json({ success: false, message: 'Failed to export subscribers.' });
  }
}
