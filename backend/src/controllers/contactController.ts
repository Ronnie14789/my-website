import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ContactSubmission from '../models/ContactSubmission';
import { emailService } from '../services/emailService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    Promise.allSettled([
      emailService.sendContactConfirmation({ name, email, subject, message }),
      emailService.sendAdminNotification({ name, email, phone, subject, message, ipAddress: req.ip }),
    ]).then(([confirmResult, adminResult]) => {
      const emailSent = confirmResult.status === 'fulfilled' && confirmResult.value.success;
      ContactSubmission.findByIdAndUpdate(submission._id, { emailSent }).catch(() => undefined);
      if (adminResult.status === 'rejected' || !adminResult.value?.success) {
        logger.warn('Admin notification email failed', { submissionId: submission._id });
      }
    });

    sendSuccess(
      res,
      { id: submission._id },
      'Message sent successfully! I will get back to you soon.',
      201
    );
  } catch (error) {
    logger.error('Contact submission error:', error);
    sendError(res, 'Failed to submit contact form', 500);
  }
};

export const listContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query['page'] as string) || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query['limit'] as string) || '20', 10)));
    const status = req.query['status'] as string;

    const filter: Record<string, unknown> = {};
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      filter['status'] = status;
    }

    const [contacts, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactSubmission.countDocuments(filter),
    ]);

    sendSuccess(res, contacts, 'Contacts retrieved', 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error('List contacts error:', error);
    sendError(res, 'Failed to retrieve contacts', 500);
  }
};

export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      sendError(res, 'Invalid status', 400);
      return;
    }

    const contact = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      sendError(res, 'Contact not found', 404);
      return;
    }

    sendSuccess(res, contact, 'Status updated');
  } catch (error) {
    logger.error('Update contact status error:', error);
    sendError(res, 'Failed to update status', 500);
  }
};
