import { Request, Response } from 'express';
import ContactSubmission from '../models/ContactSubmission';
import logger from '../utils/logger';

/**
 * @swagger
 * /contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit a contact form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
export async function submitContact(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, subject, message } = req.body;

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
    });

    logger.info(`New contact submission: ${submission._id} from ${email}`);

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      data: { id: submission._id },
    });
  } catch (error) {
    logger.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit contact form' });
  }
}

/**
 * @swagger
 * /contact:
 *   get:
 *     tags: [Contact]
 *     summary: Get all contact submissions (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied, archived]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of submissions
 *       401:
 *         description: Unauthorized
 */
export async function getSubmissions(req: Request, res: Response): Promise<void> {
  try {
    const VALID_STATUSES = ['new', 'read', 'replied', 'archived'] as const;
    type SubmissionStatus = (typeof VALID_STATUSES)[number];

    const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;
    const status = VALID_STATUSES.includes(statusParam as SubmissionStatus)
      ? (statusParam as SubmissionStatus)
      : undefined;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContactSubmission.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Submissions fetched',
      data: {
        submissions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
}
