import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';
import ContactSubmission from '../models/ContactSubmission';
import NewsletterSubscription from '../models/NewsletterSubscription';
import Project from '../models/Project';
import Testimonial from '../models/Testimonial';
import logger from '../utils/logger';

export async function getOverview(_req: Request, res: Response): Promise<void> {
  try {
    const [
      contacts,
      unreadContacts,
      activeSubscribers,
      blogPosts,
      activeProjects,
      approvedTestimonials,
    ] = await Promise.all([
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ status: 'new' }),
      NewsletterSubscription.countDocuments({ active: true }),
      BlogPost.countDocuments({ published: true }),
      Project.countDocuments({ status: { $ne: 'archived' } }),
      Testimonial.countDocuments({ approved: true }),
    ]);

    res.json({
      success: true,
      message: 'Overview fetched.',
      data: {
        contacts,
        unreadContacts,
        activeSubscribers,
        blogPosts,
        activeProjects,
        approvedTestimonials,
      },
    });
  } catch (error) {
    logger.error('Get admin overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch overview.' });
  }
}
