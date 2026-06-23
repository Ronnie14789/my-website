import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Testimonial:
 *       type: object
 *       required: [name, role, company, message, rating]
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         company:
 *           type: string
 *         message:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         avatarUrl:
 *           type: string
 *         approved:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatarUrl?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    company: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    avatarUrl: { type: String },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TestimonialSchema.index({ approved: 1, createdAt: -1 });

export default model<ITestimonial>('Testimonial', TestimonialSchema);
