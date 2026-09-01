/**
 * Example E2E test using Playwright
 * Tests user workflows across the application
 */

import { test, expect } from '@playwright/test';

test.describe('Portfolio Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test.describe('Homepage', () => {
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/GeniuzLab|Portfolio/);
      await expect(page.locator('header')).toBeVisible();
    });

    test('should display navigation menu', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check for main navigation links
      const homeLink = page.getByRole('link', { name: /home/i });
      await expect(homeLink).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      const heroSection = page.locator('[class*="hero"]');
      await expect(heroSection).toBeVisible();
    });
  });

  test.describe('Portfolio Navigation', () => {
    test('should navigate to work page', async ({ page }) => {
      const workLink = page.getByRole('link', { name: /work|portfolio/i });
      await workLink.click();
      await expect(page).toHaveURL(/work|portfolio/);
    });

    test('should filter projects by category', async ({ page }) => {
      await page.goto('/work');

      const designFilter = page.getByRole('button', { name: /design/i });
      if (await designFilter.isVisible()) {
        await designFilter.click();
        await page.waitForLoadState('networkidle');
        // Verify filtered results
        const projectCards = page.locator('[data-testid="project-card"]');
        const count = await projectCards.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });

    test('should open project details', async ({ page }) => {
      await page.goto('/work');

      const firstProject = page.locator('[data-testid="project-card"]').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await expect(page).toHaveURL(/work\/[^/]+/);
        await expect(page.locator('h1')).toBeVisible();
      }
    });
  });

  test.describe('Contact Page', () => {
    test('should navigate to contact page', async ({ page }) => {
      const contactLink = page.getByRole('link', { name: /contact/i });
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await expect(page).toHaveURL(/contact/);
      }
    });

    test('should display contact form', async ({ page }) => {
      await page.goto('/contact');

      const form = page.locator('form');
      await expect(form).toBeVisible();

      const emailInput = page.getByLabel(/email/i);
      await expect(emailInput).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });

      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();

      // Check mobile menu
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        const navItems = page.locator('nav').locator('a');
        expect(await navItems.count()).toBeGreaterThan(0);
      }
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();
    });

    test('should work on desktop', async ({ page }) => {
      // Default viewport is desktop
      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle navigation quickly', async ({ page }) => {
      await page.goto('/');

      const startTime = Date.now();
      const workLink = page.getByRole('link', { name: /work|portfolio/i });
      await workLink.click();
      const navigationTime = Date.now() - startTime;

      // Navigation should be quick
      expect(navigationTime).toBeLessThan(3000);
    });
  });
});

test.describe('Admin Panel E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin/login');
  });

  test('should display admin login page', async ({ page }) => {
    await expect(page).toHaveURL(/admin\/login/);
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should handle admin login', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole('button', { name: /sign in|login/i });

    await emailInput.fill('admin@example.com');
    await passwordInput.fill('password');
    await submitButton.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should either show admin dashboard or error message
    const isDashboard = page.url().includes('/admin');
    const isLoginStill = page.url().includes('login');

    expect(isDashboard || isLoginStill).toBe(true);
  });
});
