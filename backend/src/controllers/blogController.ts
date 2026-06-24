import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BlogPost from '../models/BlogPost';
import NewsletterSubscription from '../models/NewsletterSubscription';
import { emailService } from '../services/emailService';
import { cacheGet, cacheSet, cacheDel, cacheDelPattern } from '../config/redis';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const CACHE_TTL = 60 * 60;

export const listPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query['page'] as string) || '1', 10));
    const limit = Math.min(20, Math.max(1, parseInt((req.query['limit'] as string) || '10', 10)));
    const tag = req.query['tag'] as string;
    const search = req.query['search'] as string;

    const cacheKey = `blog:list:${page}:${limit}:${tag || ''}:${search || ''}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const filter: Record<string, unknown> = { status: 'published' };
    if (tag) filter['tags'] = { $in: [tag.toLowerCase()] };
    if (search) {
      filter['$or'] = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-content')
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    const response = {
      success: true,
      data: posts,
      message: 'Posts retrieved',
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    await cacheSet(cacheKey, JSON.stringify(response), CACHE_TTL);
    res.json(response);
  } catch (error) {
    logger.error('List posts error:', error);
    sendError(res, 'Failed to retrieve posts', 500);
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const cacheKey = `blog:post:${slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const post = await BlogPost.findOne({ slug, status: 'published' }).lean();
    if (!post) {
      sendError(res, 'Post not found', 404);
      return;
    }

    const response = { success: true, data: post, message: 'Post retrieved' };
    await cacheSet(cacheKey, JSON.stringify(response), CACHE_TTL);
    res.json(response);
  } catch (error) {
    logger.error('Get post error:', error);
    sendError(res, 'Failed to retrieve post', 500);
  }
};

export const incrementViews = async (req: Request, res: Response): Promise<void> => {
  try {
    await BlogPost.findByIdAndUpdate(req.params['id'], { $inc: { views: 1 } });
    sendSuccess(res, null, 'View counted');
  } catch (error) {
    logger.error('Track view error:', error);
    sendError(res, 'Failed to track view', 500);
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const { title, slug, excerpt, content, featuredImage, tags, status } = req.body;

    const autoSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const existing = await BlogPost.findOne({ slug: { $eq: autoSlug } });
    if (existing) {
      sendError(res, 'A post with this slug already exists', 409);
      return;
    }

    const post = await BlogPost.create({
      title,
      slug: autoSlug,
      excerpt,
      content,
      featuredImage,
      tags,
      status,
    });

    await cacheDelPattern('blog:list:*');

    if (post.status === 'published') {
      const subscribers = await NewsletterSubscription.find({ status: 'active' })
        .select('email name unsubscribeToken')
        .lean();
      if (subscribers.length > 0) {
        emailService
          .sendBlogNotification({
            post: {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              featuredImage: post.featuredImage,
            },
            subscribers,
          })
          .catch(() => undefined);
      }
    }

    sendSuccess(res, post, 'Post created', 201);
  } catch (error) {
    logger.error('Create post error:', error);
    sendError(res, 'Failed to create post', 500);
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const { title, slug, excerpt, content, featuredImage, tags, status } = req.body as {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      featuredImage?: string;
      tags?: string[];
      status?: string;
    };

    const post = await BlogPost.findByIdAndUpdate(
      req.params['id'],
      { $set: { title, slug, excerpt, content, featuredImage, tags, status } },
      { new: true, runValidators: true },
    );

    if (!post) {
      sendError(res, 'Post not found', 404);
      return;
    }

    await Promise.all([cacheDelPattern('blog:list:*'), cacheDel(`blog:post:${post.slug}`)]);

    sendSuccess(res, post, 'Post updated');
  } catch (error) {
    logger.error('Update post error:', error);
    sendError(res, 'Failed to update post', 500);
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params['id']);
    if (!post) {
      sendError(res, 'Post not found', 404);
      return;
    }

    await Promise.all([cacheDelPattern('blog:list:*'), cacheDel(`blog:post:${post.slug}`)]);

    sendSuccess(res, null, 'Post deleted');
  } catch (error) {
    logger.error('Delete post error:', error);
    sendError(res, 'Failed to delete post', 500);
  }
};
