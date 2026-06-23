import { Request, Response } from 'express';
import ContactSubmission from '../models/ContactSubmission';
import logger from '../utils/logger';
import { sanitizeOptionalString, sanitizeString } from '../utils/sanitize';

const VALID_STATUSES = ['new', 'read', 'replied', 'archived'] as const;
type SubmissionStatus = (typeof VALID_STATUSES)[number];

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
      name: sanitizeString(String(name)),
      email: sanitizeString(String(email)).toLowerCase(),
      phone: sanitizeOptionalString(phone),
      subject: sanitizeString(String(subject)),
      message: sanitizeString(String(message)),
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
      ContactSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
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

export async function updateSubmissionStatus(req: Request, res: Response): Promise<void> {
  try {
    const status = typeof req.body.status === 'string' ? req.body.status : '';

    if (!VALID_STATUSES.includes(status as SubmissionStatus)) {
      res.status(400).json({ success: false, message: 'Invalid submission status.' });
      return;
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!submission) {
      res.status(404).json({ success: false, message: 'Submission not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Submission updated.',
      data: submission,
    });
  } catch (error) {
    logger.error('Update submission status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update submission.' });
  }
}

export async function bulkUpdateSubmissionStatus(req: Request, res: Response): Promise<void> {
  try {
    const { ids, status } = req.body as { ids?: string[]; status?: string };

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'At least one submission id is required.' });
      return;
    }

    if (!VALID_STATUSES.includes(status as SubmissionStatus)) {
      res.status(400).json({ success: false, message: 'Invalid submission status.' });
      return;
    }

    const result = await ContactSubmission.updateMany({ _id: { $in: ids } }, { status });

    res.json({
      success: true,
      message: 'Submissions updated.',
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    logger.error('Bulk update submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to update submissions.' });
  }
}
