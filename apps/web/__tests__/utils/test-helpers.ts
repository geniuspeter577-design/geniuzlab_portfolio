/**
 * Test Helper Utilities for Frontend Testing
 * Provides common utilities for component and integration tests
 */

import {
  render as rtlRender,
  RenderOptions,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';

/**
 * Custom render function that includes providers
 */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { ...options });
}

/**
 * Convenience exports from Testing Library
 */
export { screen, userEvent };
export * from '@testing-library/react';

/**
 * Test data generators for components
 */
export const generateMockProject = (overrides?: any) => ({
  id: '1',
  title: 'Test Project',
  description: 'A test project description',
  category: 'Design',
  image: 'test-image.jpg',
  featured: false,
  published: true,
  slug: 'test-project',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockProjects = (count: number = 3) => {
  return Array.from({ length: count }, (_, i) =>
    generateMockProject({ id: `${i + 1}`, title: `Project ${i + 1}` })
  );
};

export const generateMockCategory = (overrides?: any) => ({
  id: '1',
  name: 'Design',
  slug: 'design',
  description: 'Design category',
  icon: 'design-icon',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockCategories = (count: number = 3) => {
  return Array.from({ length: count }, (_, i) =>
    generateMockCategory({ id: `${i + 1}`, name: `Category ${i + 1}` })
  );
};

/**
 * Mock fetch utilities
 */
export const createFetchMock = (response: any, options?: any) => {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => response,
    ...options,
  });
};

export const createFetchErrorMock = (status: number = 500, message: string = 'Error') => {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error: message }),
  });
};

/**
 * Router utilities for testing
 */
export const createMockRouter = (overrides?: any) => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  ...overrides,
});

/**
 * Session utilities
 */
export const createMockSession = (overrides?: any) => ({
  user: {
    email: 'test@example.com',
    name: 'Test User',
    ...overrides?.user,
  },
  ...overrides,
});

/**
 * Assertion helpers
 */
export const expectInDOM = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

export const expectNotInDOM = (text: string) => {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
};

export const waitForElement = async (text: string, timeout = 1000) => {
  return screen.findByText(text, {}, { timeout });
};

/**
 * User interaction helpers
 */
export const fillForm = async (formData: { [key: string]: string }) => {
  const user = userEvent.setup();
  for (const [label, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(label);
    await user.clear(input);
    await user.type(input, value);
  }
};

export const clickButton = async (text: string) => {
  const user = userEvent.setup();
  const button = screen.getByRole('button', { name: text });
  await user.click(button);
};

/**
 * Style and visibility helpers
 */
export const expectVisible = (element: any) => {
  expect(element).toBeVisible();
};

export const expectHidden = (element: any) => {
  expect(element).not.toBeVisible();
};

export const expectDisabled = (element: any) => {
  expect(element).toBeDisabled();
};

export const expectEnabled = (element: any) => {
  expect(element).toBeEnabled();
};
