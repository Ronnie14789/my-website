import { Request, Response } from 'express';
import ContactSubmission from '../models/ContactSubmission';
import BlogPost from '../models/BlogPost';
import Project from '../models/Project';
import Testimonial from '../models/Testimonial';
import NewsletterSubscription from '../models/NewsletterSubscription';
import { cacheGet, cacheSet } from '../config/redis';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'analytics:dashboard';
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const [
      totalContacts,
      newContacts,
      totalBlogPosts,
      publishedPosts,
      totalProjects,
      featuredProjects,
      pendingTestimonials,
      totalSubscribers,
      activeSubscribers,
    ] = await Promise.all([
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ status: 'new' }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Testimonial.countDocuments({ approved: false }),
      NewsletterSubscription.countDocuments(),
      NewsletterSubscription.countDocuments({ status: 'active' }),
    ]);

    const topPosts = await BlogPost.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views')
      .lean();

    const stats = {
      contacts: { total: totalContacts, new: newContacts },
      blog: { total: totalBlogPosts, published: publishedPosts },
      projects: { total: totalProjects, featured: featuredProjects },
      testimonials: { pending: pendingTestimonials },
      newsletter: { total: totalSubscribers, active: activeSubscribers },
      topPosts,
    };

    const response = { success: true, data: stats, message: 'Dashboard stats retrieved' };
    await cacheSet(cacheKey, JSON.stringify(response), 5 * 60);
    res.json(response);
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    sendError(res, 'Failed to get dashboard stats', 500);
  }
};

export const getContactTrend = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const contacts = await ContactSubmission.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendSuccess(res, contacts, 'Contact trend retrieved');
  } catch (error) {
    logger.error('Contact trend error:', error);
    sendError(res, 'Failed to get contact trend', 500);
  }
};
