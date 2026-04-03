import { test, expect } from '@playwright/test';

const openLogin = async (page) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login|portal login/i })).toBeVisible();
};

test('platform dashboard demo access shows usable demo telemetry', async ({ page }) => {
  await openLogin(page);
  await page.getByRole('button', { name: /demo platform/i }).click();

  await expect(page).toHaveURL(/\/portal\/platform\/dashboard$/);
  await expect(page.getByText('Platform Dashboard', { exact: true })).toBeVisible();
  await expect(page.getByText(/demo telemetry/i)).toBeVisible();
  await expect(page.getByText('Alpha Talent Labs', { exact: true })).toBeVisible();
  await expect(page.getByText('Webhook signing validation', { exact: true })).toBeVisible();
});

test('audit dashboard demo access shows alert and event context', async ({ page }) => {
  await openLogin(page);
  await page.getByRole('button', { name: /demo audit/i }).click();

  await expect(page).toHaveURL(/\/portal\/audit\/dashboard$/);
  await expect(page.getByText('Audit Dashboard', { exact: true })).toBeVisible();
  await expect(page.getByText(/investigation live|demo trace/i)).toBeVisible();
  await expect(page.getByText('Webhook failure spike', { exact: true })).toBeVisible();
  await expect(page.getByText('billing_webhook_failed', { exact: true })).toBeVisible();
});
