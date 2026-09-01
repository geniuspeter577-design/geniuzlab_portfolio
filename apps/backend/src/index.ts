import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes will be added here
// - POST /api/auth/login
// - POST /api/auth/logout
// - GET /api/admin/projects
// - POST /api/admin/projects
// - GET /api/admin/projects/:id
// - PUT /api/admin/projects/:id
// - DELETE /api/admin/projects/:id
// - POST /api/admin/upload-image
// - GET /api/admin/categories

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
app.listen(PORT, () => {
  console.warn(`🚀 Backend API running on http://localhost:${PORT}`);
  console.warn(`   Health check: http://localhost:${PORT}/health`);
});
