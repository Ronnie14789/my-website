import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactSubmission:
 *       type: object
 *       required: [name, email, subject, message]
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         subject:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *         message:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *         status:
 *           type: string
 *           enum: [new, read, replied, archived]
 *         ipAddress:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

// Index for admin queries
ContactSubmissionSchema.index({ status: 1, createdAt: -1 });
ContactSubmissionSchema.index({ email: 1 });

export default model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
