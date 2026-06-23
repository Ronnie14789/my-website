import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     NewsletterSubscription:
 *       type: object
 *       required: [email]
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         active:
 *           type: boolean
 *         subscribedAt:
 *           type: string
 *           format: date-time
 *         unsubscribedAt:
 *           type: string
 *           format: date-time
 *         ipAddress:
 *           type: string
 */
export interface INewsletterSubscription extends Document {
  email: string;
  active: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    active: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

NewsletterSubscriptionSchema.index({ email: 1 }, { unique: true });
NewsletterSubscriptionSchema.index({ active: 1 });

export default model<INewsletterSubscription>(
  'NewsletterSubscription',
  NewsletterSubscriptionSchema,
);
