import { Request, Response } from 'express';
import NewsletterSubscription from '../models/NewsletterSubscription';
import logger from '../utils/logger';

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
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

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
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

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
