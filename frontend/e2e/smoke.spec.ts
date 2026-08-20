import { test, expect } from '@playwright/test';

// Black-box smoke test of the deployed-as-built SPA against the real bundle
// served by `vite preview`. Covers the two highest-value paths: the public
// auth surface and protected-route enforcement.
test.describe('Command Center smoke', () => {
  test('renders the login screen for unauthenticated visitors', async ({ page }) => {
    await page.goto('/');
    // Root should redirect an anonymous user to /login
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test('shows the register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register$/);
    await expect(
      page.getByText(/Create your Command Center account/i)
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Create Account/i })
    ).toBeVisible();
  });

  test('returns 404 on unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText(/404/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Back to Dashboard/i })).toBeVisible();
  });

  test('blocks protected /workspaces for anonymous users', async ({ page }) => {
    await page.goto('/workspaces');
    // Should bounce to login rather than render protected content.
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });
});
