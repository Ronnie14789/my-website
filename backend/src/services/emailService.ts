import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string | string[];
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: SendMailOptions['attachments'];
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private getTransporter(): Transporter {
    if (!this.transporter) {
      const host = process.env.SMTP_HOST || 'smtp.gmail.com';
      const port = parseInt(process.env.SMTP_PORT || '587', 10);
      const secure = process.env.SMTP_SECURE === 'true';

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
    }
    return this.transporter;
  }

  private loadTemplate(templateName: string): { html: string; text: string } {
    const templatesDir = path.join(__dirname, '../templates');
    const htmlPath = path.join(templatesDir, `${templateName}.hbs`);
    const textPath = path.join(templatesDir, `${templateName}.txt.hbs`);

    let html = '';
    let text = '';

    if (fs.existsSync(htmlPath)) {
      html = fs.readFileSync(htmlPath, 'utf-8');
    }
    if (fs.existsSync(textPath)) {
      text = fs.readFileSync(textPath, 'utf-8');
    }

    return { html, text };
  }

  private renderTemplate(template: string, data: Record<string, unknown>): string {
    const compiled = Handlebars.compile(template);
    return compiled(data);
  }

  private async sendWithRetry(mailOptions: SendMailOptions, attempt = 1): Promise<string> {
    try {
      const info = await this.getTransporter().sendMail(mailOptions);
      return info.messageId as string;
    } catch (error) {
      if (attempt < this.maxRetries) {
        logger.warn(`Email send attempt ${attempt} failed, retrying...`, { error });
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt));
        return this.sendWithRetry(mailOptions, attempt + 1);
      }
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('Email service not configured - SMTP credentials missing');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const { html: htmlTemplate, text: textTemplate } = this.loadTemplate(options.templateName);

      const htmlBody = htmlTemplate ? this.renderTemplate(htmlTemplate, options.templateData) : '';
      const textBody = textTemplate ? this.renderTemplate(textTemplate, options.templateData) : '';

      const mailOptions: SendMailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Ecatu Ronald'}" <${process.env.SMTP_USER}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: htmlBody || undefined,
        text: textBody || undefined,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
        replyTo: options.replyTo,
      };

      const messageId = await this.sendWithRetry(mailOptions);
      logger.info('Email sent successfully', { messageId, to: options.to, subject: options.subject });
      return { success: true, messageId };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Email send failed after retries', { error: errMsg, to: options.to });
      return { success: false, error: errMsg };
    }
  }

  async sendContactConfirmation(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<EmailResult> {
    return this.sendEmail({
      to: data.email,
      subject: `Thank you for contacting me - ${data.subject}`,
      templateName: 'contact-confirmation',
      templateData: {
        name: data.name,
        subject: data.subject,
        message: data.message,
        year: new Date().getFullYear(),
        siteUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    });
  }

  async sendAdminNotification(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    ipAddress?: string;
  }): Promise<EmailResult> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || '';
    return this.sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${data.subject}`,
      templateName: 'admin-notification',
      templateData: {
        ...data,
        year: new Date().getFullYear(),
        adminUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin`,
        submittedAt: new Date().toLocaleString(),
      },
    });
  }

  async sendNewsletterConfirmation(data: {
    email: string;
    name?: string;
    unsubscribeToken: string;
  }): Promise<EmailResult> {
    return this.sendEmail({
      to: data.email,
      subject: "You're subscribed to Ecatu Ronald's newsletter!",
      templateName: 'newsletter-subscription',
      templateData: {
        name: data.name || 'Subscriber',
        email: data.email,
        unsubscribeUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?token=${data.unsubscribeToken}`,
        year: new Date().getFullYear(),
        siteUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    });
  }

  async sendBlogNotification(data: {
    post: { title: string; slug: string; excerpt: string; featuredImage?: string };
    subscribers: Array<{ email: string; name?: string; unsubscribeToken: string }>;
  }): Promise<void> {
    const results = await Promise.allSettled(
      data.subscribers.map((subscriber) =>
        this.sendEmail({
          to: subscriber.email,
          subject: `New Post: ${data.post.title}`,
          templateName: 'blog-notification',
          templateData: {
            name: subscriber.name || 'Reader',
            postTitle: data.post.title,
            postExcerpt: data.post.excerpt,
            postUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog/${data.post.slug}`,
            featuredImage: data.post.featuredImage,
            unsubscribeUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?token=${subscriber.unsubscribeToken}`,
            year: new Date().getFullYear(),
          },
        })
      )
    );

    const failed = results.filter((result) => result.status === 'rejected').length;
    if (failed > 0) {
      logger.warn(`Blog notification: ${failed}/${data.subscribers.length} emails failed`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return false;
    }
    try {
      await this.getTransporter().verify();
      return true;
    } catch {
      return false;
    }
  }
}

export const emailService = new EmailService();
