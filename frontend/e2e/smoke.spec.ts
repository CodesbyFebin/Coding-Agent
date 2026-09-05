import { test, expect } from '@playwright/test';

// Black-box smoke test of the deployed-as-built SPA against the real bundle
// served by `vite preview`. Covers the two highest-value paths: the public
// auth surface and protected-route enforcement, plus the public knowledge
// surfaces and route-resolution behavior.
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

  test('renders the public pillar directory without auth', async ({ page }) => {
    await page.goto('/pillars');
    await expect(page).toHaveURL(/\/pillars$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/pillars/i);
    await expect(page.getByRole('button', { name: /All Pillars \(80\)/i })).toBeVisible();
  });

  test('resolves a canonical pillar slug to its detail page', async ({ page }) => {
    await page.goto('/dpdp-compliance');
    await expect(
      page.getByRole('heading', { level: 1, name: /DPDP Compliance/i })
    ).toBeVisible();
  });

  test('shows the graceful pillar-not-found page on unknown single-segment routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText(/Pillar not found/i)).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Browse the Pillar Directory/i })
    ).toBeVisible();
  });

  test('returns 404 on unknown multi-segment routes', async ({ page }) => {
    await page.goto('/this-route/does-not-exist');
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
