import { test, expect } from '@playwright/test';

test.describe('Planner Page', () => {
  test.beforeEach(async ({ page }) => {
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
          { id: '1', title: 'Test Task 1', status: 'TODO', priority: 'HIGH' },
          { id: '2', title: 'Test Task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' }
        ])
      });
    });
  });

  test('should load planner and display tasks', async ({ page }) => {
    await page.goto('/dashboard/planner');
    
    // Assert planner loaded
    await expect(page.locator('text=Test Task 1')).toBeVisible();
    await expect(page.locator('text=Test Task 2')).toBeVisible();
  });

  test('should open add task modal', async ({ page }) => {
    await page.goto('/dashboard/planner');
    
    // Click on Add Task button
    await page.click('button:has-text("Add Task")');
    
    // Check if modal opens
    await expect(page.locator('text=Create Task')).toBeVisible();
    
    // Close modal
    await page.click('button[aria-label="Close"]');
  });
});
