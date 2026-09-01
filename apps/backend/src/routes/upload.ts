import express, { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';
import { uploadImage, getDefaultImageProvider, isValidMediaFile, getFileSizeLimit } from '../lib/image-upload';

const router = express.Router();

/**
 * POST /upload
 * Upload image or video to configured provider (Cloudinary or Vercel Blob)
 * Expects multipart/form-data with file and optional metadata
 */
router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = req.files.file as Express.Multer.File;

    if (!isValidMediaFile(uploadedFile.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Must be image or video' });
    }

    const provider = req.body.provider || getDefaultImageProvider();
    const fileSizeLimit = getFileSizeLimit(provider);

    if (uploadedFile.size > fileSizeLimit) {
      return res.status(400).json({
        error: `File size exceeds ${provider === 'cloudinary' ? '2GB' : '50MB'} limit`,
      });
    }

    const response = await uploadImage(
      uploadedFile.data,
      uploadedFile.name,
      provider as 'cloudinary' | 'vercel-blob',
      {
        folder: req.body.folder,
        tags: req.body.tags ? req.body.tags.split(',') : undefined,
        isVideo: uploadedFile.mimetype.startsWith('video/'),
      }
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /upload-config
 * Get current upload configuration
 */
router.get('/upload-config', (req: Request, res: Response) => {
  const provider = getDefaultImageProvider();
  const fileSizeLimit = getFileSizeLimit(provider);

  res.json({
    provider,
    fileSizeLimit,
    fileSizeLimitMB: fileSizeLimit / (1024 * 1024),
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME,
    vercelBlobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
});

export default router;
