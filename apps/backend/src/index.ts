import express from 'express';
import cors from 'cors';
import { initCloudinary } from './lib/cloudinary';
import { env } from './lib/env';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';

// Initialize Cloudinary if configured
try {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    initCloudinary();
    console.warn('✅ Cloudinary initialized');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (_error) {
  console.warn('⚠️  Cloudinary not configured, falling back to Vercel Blob');
}

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', publicRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.status((err as any).status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.warn(`🚀 Backend API listening on port ${PORT}`);
  console.warn(`   Health check: /health`);
});
