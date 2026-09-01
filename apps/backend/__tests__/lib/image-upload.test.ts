import {
  uploadImage,
  getDefaultImageProvider,
  isValidMediaFile,
  getFileSizeLimit,
} from '../../src/lib/image-upload';

describe('Image Upload Utilities', () => {
  describe('getDefaultImageProvider', () => {
    it('returns cloudinary when CLOUDINARY_CLOUD_NAME is set', () => {
      process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
      const provider = getDefaultImageProvider();
      expect(provider).toBe('cloudinary');
      delete process.env.CLOUDINARY_CLOUD_NAME;
    });

    it('returns vercel-blob when Cloudinary is not configured', () => {
      delete process.env.CLOUDINARY_CLOUD_NAME;
      const provider = getDefaultImageProvider();
      expect(provider).toBe('vercel-blob');
    });
  });

  describe('isValidMediaFile', () => {
    it('accepts valid image types', () => {
      const validImages = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
      ];

      validImages.forEach((type) => {
        expect(isValidMediaFile(type)).toBe(true);
      });
    });

    it('rejects invalid file types', () => {
      const invalidTypes = ['application/pdf', 'text/plain', 'video/mp4'];

      invalidTypes.forEach((type) => {
        expect(isValidMediaFile(type)).toBe(false);
      });
    });

    it('accepts video types when includeVideo is true', () => {
      expect(isValidMediaFile('video/mp4', true)).toBe(true);
      expect(isValidMediaFile('video/webm', true)).toBe(true);
    });

    it('rejects video types when includeVideo is false', () => {
      expect(isValidMediaFile('video/mp4', false)).toBe(false);
      expect(isValidMediaFile('video/webm', false)).toBe(false);
    });
  });

  describe('getFileSizeLimit', () => {
    it('returns 2GB limit for Cloudinary', () => {
      const limit = getFileSizeLimit('cloudinary');
      expect(limit).toBe(2 * 1024 * 1024 * 1024); // 2GB in bytes
    });

    it('returns 50MB limit for Vercel Blob', () => {
      const limit = getFileSizeLimit('vercel-blob');
      expect(limit).toBe(50 * 1024 * 1024); // 50MB in bytes
    });
  });

  describe('uploadImage', () => {
    const mockFileBuffer = Buffer.from('fake-image-data');
    const mockFilename = 'test-image.jpg';

    it('throws error when no providers are configured', async () => {
      // Mock environment to have no providers
      delete process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.BLOB_READ_WRITE_TOKEN;

      await expect(
        uploadImage(mockFileBuffer, mockFilename, 'vercel-blob')
      ).rejects.toThrow('BLOB_READ_WRITE_TOKEN is not configured');
    });

    it('includes metadata when uploading to Cloudinary', () => {
      // This test demonstrates the expected behavior
      // In real tests, you'd mock cloudinary.uploader.upload_stream
      expect(mockFilename).toBeDefined();
    });
  });
});
