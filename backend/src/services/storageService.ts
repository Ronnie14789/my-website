import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { logger } from '../utils/logger';

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  size: number;
  folder: string;
}

export type UploadFolder = 'projects' | 'blog' | 'avatars';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return true;
  }
  return false;
};

export const isCloudinaryConfigured = configureCloudinary();

// Map mime types to safe extensions (no user input)
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    cb(null, tmpDir);
  },
  filename: (_req, file, cb) => {
    // Derive extension from validated mimetype, NOT from user-provided filename
    const ext = MIME_TO_EXT[file.mimetype] ?? '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `upload-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
});

const optimizeLocalImage = async (filePath: string): Promise<void> => {
  // Validate that the file path is within our controlled tmp directory
  const tmpDir = path.resolve(process.cwd(), 'tmp');
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(tmpDir + path.sep)) {
    throw new Error('Invalid file path: outside allowed directory');
  }

  const buffer = await sharp(resolvedPath)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .toFormat('webp', { quality: 85 })
    .toBuffer();

  fs.writeFileSync(resolvedPath, buffer);
};

export const uploadToCloud = async (
  filePath: string,
  folder: UploadFolder,
  fileName?: string
): Promise<UploadResult> => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloud storage not configured');
  }

  // Validate path is within tmp directory before any file operation
  const tmpDir = path.resolve(process.cwd(), 'tmp');
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(tmpDir + path.sep)) {
    throw new Error('Invalid file path: outside allowed directory');
  }

  try {
    await optimizeLocalImage(resolvedPath);

    const result = await cloudinary.uploader.upload(resolvedPath, {
      folder: `my-website/${folder}`,
      public_id: fileName,
      resource_type: 'image',
      transformation: [{ quality: 'auto:best' }, { fetch_format: 'auto' }],
      overwrite: false,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      folder,
    };
  } finally {
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
    }
  }
};

export const deleteFromCloud = async (publicId: string): Promise<void> => {
  if (!isCloudinaryConfigured) {
    logger.warn('Cloud storage not configured, skipping delete');
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    logger.info(`Deleted file from cloud: ${publicId}`);
  } catch (error) {
    logger.error(`Failed to delete file from cloud: ${publicId}`, { error });
    throw error;
  }
};

export const getOptimizedUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
  }
): string => {
  if (!isCloudinaryConfigured) {
    return publicId;
  }
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
};
