import { put } from '@vercel/blob';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary';

export type ImageProvider = 'vercel-blob' | 'cloudinary';

export interface UploadResponse {
  url: string;
  filename: string;
  provider: ImageProvider;
  publicId?: string; // For Cloudinary
  resourceType?: string; // For Cloudinary: image, video, etc.
}

/**
 * Determine which provider to use based on environment variables
 */
export const getDefaultImageProvider = (): ImageProvider => {
  // If Cloudinary is configured, prefer it
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return 'cloudinary';
  }
  // Fall back to Vercel Blob
  return 'vercel-blob';
};

/**
 * Upload file to the configured image provider (Cloudinary or Vercel Blob)
 * @param fileBuffer - Buffer of the file
 * @param filename - Name for the file
 * @param provider - Which provider to use (defaults to configured default)
 * @param metadata - Additional metadata (tags, folder, etc.)
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  filename: string,
  provider?: ImageProvider,
  metadata?: {
    folder?: string;
    tags?: string[];
    isVideo?: boolean;
  }
): Promise<UploadResponse> => {
  const targetProvider = provider || getDefaultImageProvider();

  if (targetProvider === 'cloudinary') {
    return uploadToCloudinaryProvider(fileBuffer, filename, metadata);
  } else {
    return uploadToVercelBlob(fileBuffer, filename);
  }
};

/**
 * Upload to Cloudinary
 */
const uploadToCloudinaryProvider = async (
  fileBuffer: Buffer,
  filename: string,
  metadata?: {
    folder?: string;
    tags?: string[];
    isVideo?: boolean;
  }
): Promise<UploadResponse> => {
  const result = (await uploadToCloudinary(fileBuffer, filename, {
    folder: metadata?.folder || 'geniuzlab/portfolio',
    tags: metadata?.tags,
    resourceType: metadata?.isVideo ? 'video' : 'image',
  })) as {
    secure_url: string;
    public_id: string;
    resource_type: string;
  };

  return {
    url: result.secure_url,
    filename: result.public_id,
    provider: 'cloudinary',
    publicId: result.public_id,
    resourceType: result.resource_type,
  };
};

/**
 * Upload to Vercel Blob
 */
const uploadToVercelBlob = async (
  fileBuffer: Buffer,
  filename: string
): Promise<UploadResponse> => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const blobFilename = `portfolio-${timestamp}-${randomId}-${filename}`;

  const blob = await put(blobFilename, fileBuffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url: blob.url,
    filename: blob.pathname,
    provider: 'vercel-blob',
  };
};

/**
 * Delete image from the specified provider
 * @param publicId - Public ID of the image (Cloudinary) or pathname (Vercel Blob)
 * @param provider - Which provider to use
 */
export const deleteImage = async (
  publicId: string,
  provider: ImageProvider
): Promise<void> => {
  if (provider === 'cloudinary') {
    await deleteFromCloudinary(publicId);
  } else if (provider === 'vercel-blob') {
    // Vercel Blob deletion is not directly supported in the SDK
    // You would need to implement via their API if needed
    console.warn('Vercel Blob deletion not directly supported via SDK');
  }
};

/**
 * Verify file is a valid image or video
 */
export const isValidMediaFile = (
  mimeType: string,
  includeVideo = false
): boolean => {
  const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  const videoMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
  ];

  const allowedTypes = includeVideo
    ? [...imageMimeTypes, ...videoMimeTypes]
    : imageMimeTypes;

  return allowedTypes.includes(mimeType);
};

/**
 * Get file size limit in bytes
 */
export const getFileSizeLimit = (provider: ImageProvider): number => {
  // Cloudinary free tier: 2GB per file, 25GB storage
  // Vercel Blob: 1000 GB total storage, 4.5GB per file
  if (provider === 'cloudinary') {
    return 2 * 1024 * 1024 * 1024; // 2GB
  }
  return 50 * 1024 * 1024; // 50MB for Vercel Blob
};
