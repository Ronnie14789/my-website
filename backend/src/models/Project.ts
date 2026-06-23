import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required: [title, description]
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         longDescription:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         imageUrl:
 *           type: string
 *         liveUrl:
 *           type: string
 *         githubUrl:
 *           type: string
 *         featured:
 *           type: boolean
 *         order:
 *           type: number
 *         status:
 *           type: string
 *           enum: [active, completed, archived]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    longDescription: { type: String },
    tags: [{ type: String, trim: true }],
    imageUrl: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  },
  { timestamps: true },
);

ProjectSchema.index({ featured: 1, order: 1 });
ProjectSchema.index({ status: 1 });

export default model<IProject>('Project', ProjectSchema);
