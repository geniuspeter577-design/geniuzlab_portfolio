// Jest setup file for backend tests
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
});

// Global cleanup
afterAll(() => {
  // Clean up any test data if needed
});

// Mock console methods to reduce noise during tests (keep error for debugging)
const originalError = console.error;

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: originalError,
};

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Mock common dependencies if needed
jest.mock('express', () => {
  const actual = jest.requireActual('express');
  return actual;
});
