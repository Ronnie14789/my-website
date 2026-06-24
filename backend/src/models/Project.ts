import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  shortDescription: string;
  coverImage?: string;
  images: string[];
  tags: string[];
  technologies: string[];
  status: 'active' | 'completed' | 'archived';
  featured: boolean;
  order: number;
  githubUrl?: string;
  liveUrl?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    coverImage: { type: String },
    images: [{ type: String }],
    tags: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    githubUrl: { type: String },
    liveUrl: { type: String },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

projectSchema.index({ featured: -1, order: 1 });
projectSchema.index({ status: 1 });

const Project: Model<IProject> = mongoose.model('Project', projectSchema);
export default Project;
