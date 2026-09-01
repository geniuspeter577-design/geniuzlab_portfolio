/**
 * Test Helper Utilities for Backend Testing
 * Provides common utilities for unit, integration, and API tests
 */

import request from 'supertest';
import { Application } from 'express';

/**
 * Helper to create a test API request
 */
export class TestRequest {
  constructor(private app: Application) {}

  get(path: string) {
    return request(this.app).get(path);
  }

  post(path: string) {
    return request(this.app).post(path);
  }

  put(path: string) {
    return request(this.app).put(path);
  }

  delete(path: string) {
    return request(this.app).delete(path);
  }

  patch(path: string) {
    return request(this.app).patch(path);
  }
}

/**
 * Test data generators
 */
export const generateTestUser = (overrides?: any) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const generateTestProject = (overrides?: any) => ({
  id: '1',
  title: 'Test Project',
  description: 'A test project',
  category: 'Design',
  image: 'test-image.jpg',
  featured: false,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const generateTestCategory = (overrides?: any) => ({
  id: '1',
  name: 'Design',
  slug: 'design',
  description: 'Design category',
  icon: 'design-icon',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Mock database utilities
 */
export const createMockDatabase = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  project: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
});

/**
 * Mock authentication utilities
 */
export const createMockAuthToken = (userId: string, role: string = 'user') => {
  // Note: In real tests, generate actual JWT tokens
  return `Bearer mock-token-${userId}-${role}`;
};

/**
 * Error assertion helpers
 */
export const expectErrorResponse = (
  response: any,
  status: number,
  message: string
) => {
  expect(response.status).toBe(status);
  expect(response.body.error).toBeDefined();
  expect(response.body.error.message).toContain(message);
};

export const expectValidationError = (
  response: any,
  field: string
) => {
  expect(response.status).toBe(400);
  expect(response.body.error).toBeDefined();
  expect(response.body.error.errors).toBeDefined();
  const fieldError = response.body.error.errors.find(
    (e: any) => e.field === field
  );
  expect(fieldError).toBeDefined();
};

/**
 * Database cleanup utilities
 */
export const cleanupTestData = async (prisma: any) => {
  // Clean up in reverse order of dependencies
  await prisma.project.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
};

/**
 * Setup/Teardown helpers
 */
export const setupTestDatabase = async (prisma: any) => {
  // Create test data
  const user = await prisma.user.create({
    data: generateTestUser(),
  });

  const category = await prisma.category.create({
    data: generateTestCategory(),
  });

  return { user, category };
};
