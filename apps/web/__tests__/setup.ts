// Vitest setup file for web tests
import '@testing-library/jest-dom';
import './mocks/handlers'; // MSW server setup happens here
import { vi } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock next/image for testing
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return `<img src="${src}" alt="${alt}" {...props} />`;
  },
}));
