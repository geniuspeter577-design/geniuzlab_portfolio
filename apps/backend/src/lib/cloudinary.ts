import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary Configuration
 * Provides centralized setup for Cloudinary image and video hosting
 */

// Initialize Cloudinary with environment variables
export const initCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME environment variable is required');
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY environment variable is required');
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET environment variable is required');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
};

/**
 * Upload file to Cloudinary
 * @param fileBuffer - Buffer of the file to upload
 * @param filename - Name for the file
 * @param options - Additional Cloudinary upload options
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  filename: string,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
    tags?: string[];
  } = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: options.resourceType || 'auto',
        folder: options.folder || 'geniuzlab/portfolio',
        public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension for public_id
        tags: ['portfolio', ...(options.tags || [])],
        // Transformation options for optimization
        eager: [
          {
            quality: 'auto',
            fetch_format: 'auto',
            width: 1200,
            crop: 'fit',
          },
          {
            quality: 'auto',
            fetch_format: 'auto',
            width: 800,
            crop: 'fit',
          },
          {
            quality: 'auto',
            fetch_format: 'auto',
            width: 400,
            crop: 'fit',
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 */
export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Generate secure URL for Cloudinary resource
 * Useful for video downloads or private resources
 * @param publicId - Public ID of the resource
 * @param options - Transformation options
 */
export const generateCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif';
  } = {}
) => {
  return cloudinary.url(publicId, {
    secure: true,
    quality: options.quality || 'auto',
    format: options.format || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fit',
  });
};

/**
 * Get resource info from Cloudinary
 * @param publicId - Public ID of the resource
 */
export const getCloudinaryResourceInfo = async (publicId: string) => {
  return cloudinary.api.resource(publicId);
};

export default cloudinary;
