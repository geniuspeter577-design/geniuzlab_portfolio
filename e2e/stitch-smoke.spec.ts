import { expect, test } from '@playwright/test';

test.describe('Stitch smoke checks', () => {
  test('public routes render the main studio pages', async ({ page }) => {
    const checks = [
      { path: '/', expected: /GeniuzLab|Portfolio/i },
      { path: '/work', expected: /Our Work|Portfolio archive/i },
      { path: '/about', expected: /About|Creative/i },
      { path: '/services', expected: /Services|Creative/i },
      { path: '/contact', expected: /Create something remarkable|Contact/i },
      { path: '/search', expected: /Search the archive|Search/i },
    ];

    for (const check of checks) {
      await page.goto(check.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toContainText(check.expected);
    }
  });

  test('admin login is reachable', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText(/Admin login|Log in/i);
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('search accepts input and shows archive results state', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    const searchBox = page.getByRole('searchbox');
    await expect(searchBox).toBeVisible();
    await searchBox.fill('brand');
    await expect(page.locator('body')).toContainText(/result|results|matching/i);
  });
});
