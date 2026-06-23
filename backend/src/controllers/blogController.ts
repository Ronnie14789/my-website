import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';
import logger from '../utils/logger';

/**
 * @swagger
 * /blog:
 *   get:
 *     tags: [Blog]
 *     summary: Get published blog posts
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
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
 *         description: List of blog posts
 */
export async function getPosts(req: Request, res: Response): Promise<void> {
  try {
    const { tag, page = 1, limit = 10 } = req.query;
    const filter: Record<string, unknown> = { published: true };
    if (tag) filter.tags = tag;

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      BlogPost.find(filter, '-content')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Posts fetched',
      data: { posts, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } },
    });
  } catch (error) {
    logger.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
}

/**
 * @swagger
 * /blog/{slug}:
 *   get:
 *     tags: [Blog]
 *     summary: Get blog post by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post found
 *       404:
 *         description: Not found
 */
export async function getPostBySlug(req: Request, res: Response): Promise<void> {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }
    // Increment views
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    res.json({ success: true, message: 'Post found', data: post });
  } catch (error) {
    logger.error('Get post by slug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
}
