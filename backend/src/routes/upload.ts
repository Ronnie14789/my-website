import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';
import {
  upload,
  uploadToCloud,
  isCloudinaryConfigured,
  UploadFolder,
} from '../services/storageService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const router = Router();

const handleUpload =
  (folder: UploadFolder) =>
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      sendError(res, 'No file uploaded', 400);
      return;
    }

    if (!isCloudinaryConfigured) {
      sendError(
        res,
        'Cloud storage not configured. Please set Cloudinary environment variables.',
        503,
      );
      return;
    }

    try {
      const fileName = `${folder}-${Date.now()}`;
      const result = await uploadToCloud(req.file.path, folder, fileName);

      sendSuccess(
        res,
        {
          url: result.url,
          publicId: result.publicId,
          format: result.format,
          width: result.width,
          height: result.height,
          size: result.size,
          folder: result.folder,
        },
        'File uploaded successfully',
        201,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      logger.error('File upload error:', { error: message, folder });
      sendError(res, message, 500);
    }
  };

const uploadMiddleware = () => upload.single('image');

router.post(
  '/project-image',
  authenticate,
  uploadLimiter,
  uploadMiddleware(),
  handleUpload('projects'),
);
router.post('/blog-image', authenticate, uploadLimiter, uploadMiddleware(), handleUpload('blog'));
router.post('/avatar', authenticate, uploadLimiter, uploadMiddleware(), handleUpload('avatars'));

export default router;
