import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';
import logger from '../utils/logger';
import { sanitizeOptionalString, sanitizeString, sanitizeStringArray } from '../utils/sanitize';

interface BlogPostBody {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
    const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : undefined;
    const search = typeof req.query.q === 'string' ? sanitizeString(req.query.q).toLowerCase() : '';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const filter: Record<string, unknown> = { published: true };
    if (tag) filter.tags = tag;
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter, '-content').sort({ publishedAt: -1 }).skip(skip).limit(limit),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Posts fetched',
      data: { posts, pagination: { total, page, pages: Math.ceil(total / limit) } },
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
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      published: true,
      ...(post.tags.length > 0 ? { tags: { $in: post.tags } } : {}),
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('-content');

    res.json({
      success: true,
      message: 'Post found',
      data: {
        post,
        relatedPosts,
      },
    });
  } catch (error) {
    logger.error('Get post by slug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
}

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as BlogPostBody;
    const post = await BlogPost.create({
      title: sanitizeString(String(body.title)),
      slug: sanitizeString(String(body.slug)).toLowerCase(),
      excerpt: sanitizeString(String(body.excerpt)),
      content: sanitizeString(String(body.content)),
      coverImage: sanitizeOptionalString(body.coverImage),
      tags: sanitizeStringArray(body.tags, true),
      published: body.published === true,
      readTime: Math.max(
        1,
        Math.ceil(sanitizeString(String(body.content)).split(/\s+/).length / 200),
      ),
    });

    res.status(201).json({ success: true, message: 'Post created.', data: post });
  } catch (error) {
    logger.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post.' });
  }
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as BlogPostBody;
    const update: Record<string, unknown> = {};

    if (body.title !== undefined) update.title = sanitizeString(body.title);
    if (body.slug !== undefined) update.slug = sanitizeString(body.slug).toLowerCase();
    if (body.excerpt !== undefined) update.excerpt = sanitizeString(body.excerpt);
    if (body.content !== undefined) {
      update.content = sanitizeString(body.content);
      update.readTime = Math.max(
        1,
        Math.ceil(sanitizeString(body.content).split(/\s+/).length / 200),
      );
    }
    if (body.coverImage !== undefined) update.coverImage = sanitizeOptionalString(body.coverImage);
    if (body.tags !== undefined) update.tags = sanitizeStringArray(body.tags, true);
    if (body.published !== undefined) update.published = body.published === true;

    const post = await BlogPost.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found.' });
      return;
    }

    res.json({ success: true, message: 'Post updated.', data: post });
  } catch (error) {
    logger.error('Update post error:', error);
    res.status(500).json({ success: false, message: 'Failed to update post.' });
  }
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found.' });
      return;
    }

    res.json({ success: true, message: 'Post deleted.' });
  } catch (error) {
    logger.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post.' });
  }
}
