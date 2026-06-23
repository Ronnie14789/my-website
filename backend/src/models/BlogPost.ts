import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogPost:
 *       type: object
 *       required: [title, slug, excerpt, content]
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         excerpt:
 *           type: string
 *         content:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         published:
 *           type: boolean
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         readTime:
 *           type: number
 *         views:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  readTime?: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String, trim: true, lowercase: true }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime: { type: Number },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ published: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });

// Auto-set publishedAt when transitioning to published
BlogPostSchema.pre('save', function (next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default model<IBlogPost>('BlogPost', BlogPostSchema);
