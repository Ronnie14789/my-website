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
    const { status, page = 1, limit = 20 } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [submissions, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactSubmission.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Submissions fetched',
      data: {
        submissions,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
}
