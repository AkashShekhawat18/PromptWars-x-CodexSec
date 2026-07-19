import { test, expect } from '@playwright/test';

test.describe('AI Chat Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/user/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', name: 'Test User' } })
      });
    });
  });

  test('should load chat interface successfully', async ({ page }) => {
    await page.goto('/dashboard/chat');
    
    // Assert chat loaded
    await expect(page.locator('text=AI Assistant')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });
});
