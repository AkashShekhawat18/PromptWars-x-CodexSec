import { test, expect } from '@playwright/test';

test.describe('Workflow Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/user/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', name: 'Test User' } })
      });
    });

    // We can mock the workflow fetching if any
  });

  test('should load workflow engine successfully', async ({ page }) => {
    await page.goto('/dashboard/workflows');
    
    // Assert workflow loaded
    await expect(page.locator('text=Workflow Engine')).toBeVisible();
    await expect(page.locator('text=Design, orchestrate, and deploy')).toBeVisible();
  });
});
