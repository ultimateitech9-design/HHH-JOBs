import { test, expect } from '@playwright/test';

test.describe('Student Portal E2E', () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: typeof process.env.BASE_URL === 'string' ? process.env.BASE_URL : 'http://127.0.0.1:4173',
          localStorage: [
            { name: 'job_portal_token', value: 'mock-student-token' },
            { name: 'job_portal_user', value: JSON.stringify({ id: 'mock-student', role: 'student', name: 'Mock Student' }) }
          ]
        }
      ]
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.route('**/student/dashboard/overview', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profile: { headline: 'Frontend Developer' },
          counters: { appliedJobs: 2 },
          recommendedJobs: [ { id: 'job-1', jobTitle: 'Frontend Developer', companyName: 'Tech Co' } ]
        })
      });
    });

    await page.route('**/student/profile', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ profile: { education: [], experience: [], skills: [] } })
      });
    });

    await page.route('**/jobs*', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          jobs: [
            { id: 'job-1', jobTitle: 'Frontend Developer', companyName: 'Tech Co' },
            { id: 'job-2', jobTitle: 'Backend Engineer', companyName: 'Data Co' }
          ]
        })
      });
    });

    await page.route('**/student/saved-jobs', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          savedJobs: [ { id: 'saved-1', job: { id: 'job-1', jobTitle: 'Frontend Developer', companyName: 'Tech Co' } } ]
        })
      });
    });
  });

  test('user can log in securely and see dashboard', async ({ page }) => {
    await page.goto('/portal/student/dashboard');
    await expect(page.getByText(/Student Workspace/i, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/Frontend Developer/i, { exact: false }).first()).toBeVisible();
  });

  test('user can update their profile', async ({ page }) => {
    await page.goto('/portal/student/profile');
    await expect(page.getByRole('heading', { name: /profile/i }).first()).toBeVisible();
  });

  test('user can view jobs', async ({ page }) => {
    await page.goto('/portal/student/jobs');
    await expect(page.getByRole('heading', { name: /Search and Apply Jobs/i }).first()).toBeVisible();
    await expect(page.getByText('Frontend Developer')).toBeVisible();
    await expect(page.getByText('Backend Engineer')).toBeVisible();
  });

  test('user can view saved jobs', async ({ page }) => {
    await page.goto('/portal/student/saved-jobs');
    await expect(page.getByRole('heading', { name: /Your Saved Opportunities/i }).first()).toBeVisible();
    await expect(page.getByText('Frontend Developer').first()).toBeVisible();
  });
});
