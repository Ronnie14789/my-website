import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  email?: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true },
    company: { type: String, trim: true, maxlength: 100 },
    role: { type: String, trim: true, maxlength: 100 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, required: true, default: 5 },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    avatarUrl: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

testimonialSchema.index({ approved: 1, featured: -1 });

const Testimonial: Model<ITestimonial> = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
