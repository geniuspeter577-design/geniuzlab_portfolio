/**
 * MSW (Mock Service Worker) Setup for Frontend Tests
 * Provides API mocking for component and integration tests
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define API handlers for tests
export const handlers = [
  // Projects endpoints
  http.get('/api/admin/projects', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Project 1',
        description: 'Test description',
        category: 'Design',
        image: 'test1.jpg',
        featured: true,
        published: true,
      },
      {
        id: '2',
        title: 'Test Project 2',
        description: 'Test description 2',
        category: 'Branding',
        image: 'test2.jpg',
        featured: false,
        published: true,
      },
    ]);
  }),

  http.post('/api/admin/projects', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(
      {
        id: '3',
        ...data,
      },
      { status: 201 }
    );
  }),

  http.get('/api/admin/projects/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Project',
      description: 'Test description',
      category: 'Design',
      image: 'test.jpg',
      featured: false,
      published: true,
    });
  }),

  http.put('/api/admin/projects/:id', async ({ params, request }) => {
    const data = await request.json();
    return HttpResponse.json({
      id: params.id,
      ...data,
    });
  }),

  http.delete('/api/admin/projects/:id', ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id });
  }),

  // Categories endpoints
  http.get('/api/admin/categories', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Design',
        slug: 'design',
        description: 'Design work',
        icon: 'design-icon',
      },
      {
        id: '2',
        name: 'Branding',
        slug: 'branding',
        description: 'Branding work',
        icon: 'branding-icon',
      },
    ]);
  }),

  http.post('/api/admin/categories', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: '3', ...data }, { status: 201 });
  }),

  // Upload image endpoint
  http.post('/api/admin/upload-image', async ({ request }) => {
    return HttpResponse.json(
      {
        url: 'https://example.com/mock-image.jpg',
      },
      { status: 201 }
    );
  }),

  // Auth endpoints
  http.post('/api/auth/signin', async ({ request }) => {
    const data = await request.json();
    if (data.email === 'admin@example.com' && data.password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
        },
      });
    }
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/signout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
      },
    });
  }),
];

// Setup MSW server for tests
export const server = setupServer(...handlers);

// Enable API mocking before all tests
beforeAll(() => server.listen());

// Reset handlers and requests after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
