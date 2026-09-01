# Cloudinary Integration Guide

GeniuzLab Portfolio supports **Cloudinary** for advanced image and video hosting, transformations, and optimization alongside (or instead of) Vercel Blob.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Configuration](#configuration)
4. [Features](#features)
5. [Usage](#usage)
6. [Migration](#migration)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### Why Cloudinary?

Cloudinary provides a powerful, developer-friendly platform for image and video management:

| Feature | Cloudinary | Vercel Blob |
|---------|-----------|------------|
| **Max File Size** | 2GB | 4.5GB |
| **Storage** | 25GB free | 1000GB free |
| **Image Optimization** | ✅ Automatic | ❌ Manual |
| **Transformations** | ✅ Real-time URL-based | ❌ Not supported |
| **Video Support** | ✅ Full support | ❌ Not supported |
| **Analytics** | ✅ Advanced | ❌ Basic |
| **Responsive Delivery** | ✅ Auto format/compression | ⚠️ Partial |
| **CDN Global** | ✅ Multi-region | ✅ Vercel CDN |

### Hybrid Approach

This project uses a **hybrid approach**: both Cloudinary and Vercel Blob can be configured simultaneously. Choose which provider to use per upload, or set a default.

---

## Setup

### Step 1: Create Cloudinary Account

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Choose a plan (free tier includes 25GB storage)
3. Go to **Dashboard > Settings > API Keys**

### Step 2: Get API Credentials

From Cloudinary Dashboard:
- **Cloud Name** - Your unique Cloudinary identifier
- **API Key** - Public key for your account
- **API Secret** - Private key (keep secret, never commit!)

### Step 3: Add Environment Variables

Update `.env.local` or your platform's environment settings:

```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Never commit these to Git!** Use platform secrets (Vercel, Railway, etc.)

---

## Configuration

### Backend Configuration

The backend automatically initializes Cloudinary on startup if environment variables are set:

```typescript
// apps/backend/src/index.ts
import { initCloudinary } from './lib/cloudinary';

try {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    initCloudinary();
    console.warn('✅ Cloudinary initialized');
  }
} catch (error) {
  console.warn('⚠️  Cloudinary not configured, using Vercel Blob');
}
```

### Default Provider Selection

The system automatically selects the default provider:

1. **If Cloudinary is configured** → Use Cloudinary
2. **Otherwise** → Use Vercel Blob
3. **Fallback** → Error if neither is configured

```typescript
// apps/backend/src/lib/image-upload.ts
export const getDefaultImageProvider = (): ImageProvider => {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return 'cloudinary';
  }
  return 'vercel-blob';
};
```

### Folder Organization in Cloudinary

Uploaded images are organized in Cloudinary's folder structure:

```
geniuzlab/
├── portfolio/            # Default portfolio uploads
│   ├── project-name/
│   └── ...
├── temp/                 # Temporary uploads
└── archive/              # Old/deleted images
```

---

## Features

### 1. Automatic Image Optimization

Cloudinary automatically optimizes images on upload:

- **Format Detection** - Serves WebP to modern browsers, JPEG/PNG to older ones
- **Compression** - Reduces file size while maintaining quality
- **Responsive Sizes** - Creates 3 optimized variants:
  - 1200px (desktop)
  - 800px (tablet)
  - 400px (mobile)

### 2. Real-time Transformations

Modify images on-the-fly using URL parameters (no re-upload needed):

```typescript
// apps/backend/src/lib/cloudinary.ts
const url = generateCloudinaryUrl('portfolio/project-name', {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  format: 'auto'
});
// Output: https://res.cloudinary.com/.../w_800,h_600,c_fill,q_auto,f_auto/...
```

### 3. Video Support

Upload and serve videos with automatic optimization:

```typescript
const response = await uploadImage(
  videoBuffer,
  'my-video.mp4',
  'cloudinary',
  { isVideo: true }
);
```

**Supported formats:** MP4, WebM, QuickTime, AVI

### 4. Advanced Analytics

Track image performance in Cloudinary Dashboard:
- **Bandwidth usage** - Monitor delivery costs
- **Traffic patterns** - See which images are popular
- **Performance metrics** - Image transformation stats

---

## Usage

### Backend Upload Endpoint

```bash
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: File object (required)
- provider: "cloudinary" | "vercel-blob" | "auto" (optional)
- folder: "geniuzlab/custom-folder" (optional)
- tags: "tag1,tag2" (optional)
```

**Example:**

```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@image.jpg" \
  -F "provider=cloudinary" \
  -F "folder=geniuzlab/portfolio" \
  -F "tags=portfolio,design"
```

**Response:**

```json
{
  "url": "https://res.cloudinary.com/.../image.jpg",
  "filename": "portfolio/image",
  "provider": "cloudinary",
  "publicId": "geniuzlab/portfolio/image",
  "resourceType": "image"
}
```

### Frontend Upload Hook

The existing `useImageUpload` hook works automatically with Cloudinary:

```typescript
import { useImageUpload } from '@/hooks/useImageUpload';

export function ProjectForm() {
  const { uploadImage, uploading, error } = useImageUpload();

  const handleImageSelect = async (file: File) => {
    try {
      const result = await uploadImage(file);
      console.log('Image URL:', result.url);
      console.log('Provider:', result.provider);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => handleImageSelect(e.target.files?.[0]!)}
      disabled={uploading}
    />
  );
}
```

### Programmatic Upload (Backend)

```typescript
import { uploadImage } from './lib/image-upload';

// Upload to Cloudinary
const response = await uploadImage(
  fileBuffer,
  'project-cover.jpg',
  'cloudinary',
  {
    folder: 'geniuzlab/portfolio',
    tags: ['featured', 'portfolio']
  }
);

// Response:
// {
//   url: "https://res.cloudinary.com/.../project-cover.jpg",
//   publicId: "geniuzlab/portfolio/project-cover",
//   provider: "cloudinary"
// }
```

### Image Deletion

```typescript
import { deleteImage } from './lib/image-upload';

await deleteImage('geniuzlab/portfolio/image-name', 'cloudinary');
```

---

## Migration

### Migrate from Vercel Blob to Cloudinary

1. **Keep existing Vercel Blob images live** (no action needed)

2. **New uploads use Cloudinary**:
   - Set `CLOUDINARY_CLOUD_NAME` and API keys
   - System auto-switches to Cloudinary
   - Old Vercel Blob images remain accessible

3. **Optional: Migrate existing images**:

```typescript
import { uploadImage } from './lib/image-upload';
import { put } from '@vercel/blob';

async function migrateImage(blobUrl: string, filename: string) {
  // Fetch from Vercel Blob
  const response = await fetch(blobUrl);
  const buffer = await response.arrayBuffer();

  // Upload to Cloudinary
  const cloudinaryResponse = await uploadImage(
    Buffer.from(buffer),
    filename,
    'cloudinary'
  );

  // Update database with new Cloudinary URL
  await updateProjectImage(cloudinaryResponse.url);
}
```

### Keep Hybrid Setup

To maintain both providers:

```typescript
// Allow choosing per upload
const provider = req.body.provider || 'cloudinary'; // default to cloudinary
const response = await uploadImage(buffer, filename, provider);
```

---

## Troubleshooting

### "Cloudinary not configured" warning

**Cause:** Environment variables missing

**Solution:** Set required variables in `.env.local`:
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### "Invalid API credentials" error

**Cause:** Wrong API Key or Secret

**Solution:**
1. Verify credentials in Cloudinary Dashboard
2. Check for extra spaces/newlines in `.env.local`
3. Restart backend server after env changes

### "Storage quota exceeded"

**Cause:** Used 25GB (free tier limit)

**Solution:**
1. Upgrade Cloudinary plan
2. Delete unused images from Cloudinary Dashboard
3. Switch to Vercel Blob for new uploads: `provider: 'vercel-blob'`

### Video upload fails

**Cause:** Format not supported or file too large

**Solution:**
- Supported: MP4, WebM, QuickTime, AVI
- Max size: 2GB
- Compress video before upload if needed

### Images not displaying

**Cause:** Public ID or URL incorrect

**Solution:**
1. Verify public ID in Cloudinary Dashboard
2. Check URL format: `https://res.cloudinary.com/{cloud-name}/image/upload/{public-id}`
3. Ensure images are published (not draft)

---

## Performance Tips

### 1. Use Responsive Images

```typescript
// Generate URL with responsive parameters
const imageUrl = generateCloudinaryUrl('portfolio/image', {
  width: 1200,
  quality: 'auto',
  format: 'auto'
});

// Use in HTML
<img
  src={imageUrl}
  srcSet={`
    ${imageUrl.replace('w_1200', 'w_400')} 400w,
    ${imageUrl.replace('w_1200', 'w_800')} 800w,
    ${imageUrl} 1200w
  `}
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
/>
```

### 2. Tag Your Assets

Organize for easy management and analytics:

```typescript
await uploadImage(buffer, 'cover.jpg', 'cloudinary', {
  tags: ['portfolio', 'featured', 'project-2024']
});
```

### 3. Monitor Usage

Visit **Cloudinary Dashboard > Media Library** to:
- See bandwidth usage
- Identify popular images
- Manage storage quota

---

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [URL Transformation Guide](https://cloudinary.com/documentation/image_transformations)
- [API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Next.js Cloudinary](https://next.cloudinary.dev/)
