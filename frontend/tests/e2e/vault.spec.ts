import { test, expect } from '@playwright/test';

test.describe('Knowledge Vault Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/user/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', name: 'Test User' } })
      });
    });

    await page.route('/api/documents*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Test Document', fileType: 'pdf', url: 'http://test.com', uploadedAt: new Date().toISOString() }
        ])
      });
    });
  });

  test('should load knowledge vault successfully', async ({ page }) => {
    await page.goto('/dashboard/vault');
    
    // Assert vault loaded
    await expect(page.locator('text=Knowledge Vault')).toBeVisible();
    await expect(page.locator('text=Test Document')).toBeVisible();
  });
});
