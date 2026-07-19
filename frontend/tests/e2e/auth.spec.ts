import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the login API route
    await page.route('/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', email: 'test@example.com' } })
      });
    });
    // Mock the signup API route
    await page.route('/api/auth/signup', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', email: 'test@example.com' } })
      });
    });
    // Mock the user profile route
    await page.route('/api/user/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user', name: 'Test User' } })
      });
    });
  });

  test('should navigate to login page and login successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/NeuroFlow/);
    
    // Check if form renders
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Assert navigation to dashboard
    await page.waitForURL('**/dashboard**');
    await expect(page.url()).toContain('/dashboard');
  });

  test('should navigate to signup page and signup successfully', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveTitle(/NeuroFlow/);
    
    // Check if form renders
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.check('button[role="checkbox"]');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Assert success screen
    await expect(page.locator('text=Account created')).toBeVisible();
  });
});
