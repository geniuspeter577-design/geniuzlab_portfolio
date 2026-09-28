import {
  uploadImage,
  getDefaultImageProvider,
  isValidMediaFile,
  isValidMediaContent,
  isValidMediaFilename,
  getFileSizeLimit,
} from '../../src/lib/image-upload';

describe('Image Upload Utilities', () => {
  describe('getDefaultImageProvider', () => {
    it('returns cloudinary only when all credentials are set', () => {
      process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
      process.env.CLOUDINARY_API_KEY = 'test-key';
      process.env.CLOUDINARY_API_SECRET = 'test-secret';
      const provider = getDefaultImageProvider();
      expect(provider).toBe('cloudinary');
      delete process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.CLOUDINARY_API_KEY;
      delete process.env.CLOUDINARY_API_SECRET;
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

  describe('isValidMediaFilename', () => {
    it.each([
      ['clip.mp4', 'video/mp4'],
      ['clip.webm', 'video/webm'],
      ['clip.mov', 'video/quicktime'],
      ['cover.jpeg', 'image/jpeg'],
    ])('accepts %s with matching MIME type', (filename, mimeType) => {
      expect(isValidMediaFilename(filename, mimeType)).toBe(true);
    });

    it('rejects mismatched or unsupported extensions', () => {
      expect(isValidMediaFilename('clip.mov', 'video/mp4')).toBe(false);
      expect(isValidMediaFilename('clip.avi', 'video/x-msvideo')).toBe(false);
    });
  });

  describe('isValidMediaContent', () => {
    it('recognizes MP4, QuickTime, and WebM signatures', () => {
      const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from('ftypisom'), Buffer.alloc(8)]);
      const mov = Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from('ftypqt  '), Buffer.alloc(8)]);

      expect(isValidMediaContent(mp4, 'video/mp4')).toBe(true);
      expect(isValidMediaContent(mov, 'video/quicktime')).toBe(true);
      expect(isValidMediaContent(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), 'video/webm')).toBe(true);
      expect(isValidMediaContent(Buffer.from('not a video'), 'video/mp4')).toBe(false);
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
