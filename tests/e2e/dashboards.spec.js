import { test, expect } from '@playwright/test';

const openLogin = async (page) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
};

test('admin dashboard smoke', async ({ page }) => {
  await openLogin(page);
  await page.getByRole('button', { name: /demo admin/i }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /platform analytics/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /users management/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /jobs control/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /payment management/i })).toBeVisible();
});

test('hr dashboard smoke', async ({ page }) => {
  await openLogin(page);
  await page.getByRole('button', { name: /demo hr/i }).click();

  await expect(page).toHaveURL(/\/hr$/);
  await expect(page.getByRole('heading', { name: /hr dashboard/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /candidates/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /interviews/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /payments/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /notifications/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /chat/i })).toBeVisible();

  await page.getByRole('button', { name: /candidates/i }).click();
  await expect(page.getByPlaceholder('Skills (comma separated)')).toBeVisible();

  await page.getByRole('button', { name: /interviews/i }).click();
  await expect(page.getByRole('button', { name: /schedule interview/i })).toBeVisible();

  await page.getByRole('button', { name: /payments/i }).click();
  await expect(page.getByRole('button', { name: /mark paid/i })).toBeVisible();

  await page.getByRole('button', { name: /chat/i }).click();
  await expect(page.getByPlaceholder('Type message')).toBeVisible();
});

test('student dashboard smoke', async ({ page }) => {
  await openLogin(page);
  await page.getByRole('button', { name: /demo student/i }).click();

  await expect(page).toHaveURL(/\/student$/);
  await expect(page.getByRole('heading', { name: /student \/ professional dashboard/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /saved/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /alerts/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /interviews/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /notifications/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /reviews/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /chat/i })).toBeVisible();

  await page.getByRole('button', { name: /saved/i }).click();
  await expect(page.locator('body')).toContainText(/saved|frontend|backend|job/i);

  await page.getByRole('button', { name: /alerts/i }).click();
  await expect(page.getByRole('button', { name: /create alert/i })).toBeVisible();

  await page.getByRole('button', { name: /reviews/i }).click();
  await expect(page.getByRole('button', { name: /submit review/i })).toBeVisible();

  await page.getByRole('button', { name: /chat/i }).click();
  await expect(page.getByPlaceholder('Type message')).toBeVisible();
});
