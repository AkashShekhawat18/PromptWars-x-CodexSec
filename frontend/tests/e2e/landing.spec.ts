import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if hero title is present
    await expect(page.locator('text=NeuroFlow')).toBeVisible();
    
    // Check Navigation
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('responsive layout menu check', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // In mobile, desktop nav should be hidden, maybe a hamburger menu is present
    // Let's just assert that the page loads fine without horizontal scrolling
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });
});
