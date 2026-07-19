import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the user profile API to fake being logged in
    await page.route('/api/user/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', name: 'Test User' } })
      });
    });

    await page.route('/api/tasks*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Test Task', status: 'TODO', priority: 'HIGH' }
        ])
      });
    });
  });

  test('should load dashboard overview successfully', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Assert dashboard loaded
    await expect(page.locator('text=NeuroFlow')).toBeVisible();
    await expect(page.locator('text=Command Center')).toBeVisible();
  });

  test('should navigate across sidebar links', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on Planner
    await page.click('text=AI Planner');
    await expect(page.url()).toContain('/dashboard/planner');
    
    // Click on Vault
    await page.click('text=Knowledge Vault');
    await expect(page.url()).toContain('/dashboard/vault');

    // Click on Workflows
    await page.click('text=Workflows');
    await expect(page.url()).toContain('/dashboard/workflows');
  });
});
