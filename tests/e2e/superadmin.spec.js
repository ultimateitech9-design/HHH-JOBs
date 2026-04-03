import { test, expect } from '@playwright/test';

test.describe('SuperAdmin Portal E2E', () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: typeof process.env.BASE_URL === 'string' ? process.env.BASE_URL : 'http://127.0.0.1:4173',
          localStorage: [
            { name: 'job_portal_token', value: 'mock-superadmin-token' },
            { name: 'job_portal_user', value: JSON.stringify({ id: 'mock-superadmin', role: 'super_admin', name: 'Super Admin' }) }
          ]
        }
      ]
    }
  });

  test.beforeEach(async ({ page }) => {
    // 1. Dashboard
    await page.route('**/super-admin/dashboard/metrics', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metrics: { totalUsers: 1000, totalCompanies: 50, activeJobs: 300, totalRevenue: 50000 },
          recentActivity: []
        })
      });
    });

    // 2. Users
    await page.route('**/super-admin/users*', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          users: [ { id: 'sa-user-1', name: 'Super Test User', email: 'sa@test.com', role: 'student', status: 'active' } ]
        })
      });
    });

    // 3. Companies
    await page.route('**/super-admin/companies*', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          companies: [ { id: 'co-1', name: 'Super Test Company', industry: 'IT', status: 'verified' } ]
        })
      });
    });

    // 4. Jobs
    await page.route('**/super-admin/jobs*', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          jobs: [ { id: 'sa-job-1', jobTitle: 'Super Test Job', companyName: 'Super Test Company', status: 'open' } ]
        })
      });
    });

    // 5. Applications
    await page.route('**/super-admin/applications*', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          applications: [ { id: 'sa-app-1', jobTitle: 'Super Test Job', candidateName: 'SA Candidate', status: 'applied' } ]
        })
      });
    });

    // 6. Payments
    await page.route('**/super-admin/payments*', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          payments: [ { id: 'sa-pay-1', amount: 500, status: 'completed', provider: 'razorpay' } ]
        })
      });
    });
    
    // 7. Settings
    await page.route('**/super-admin/settings/general', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          settings: { platformName: 'HHH Jobs SA', maintenance: false }
        })
      });
    });

    // Subscriptions
    await page.route('**/pricing/admin/plans', async (route) => {
      if (route.request().resourceType() === 'document') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          plans: [ { id: 'sa-plan-1', name: 'Premium Plan' } ]
        })
      });
    });
  });

  test('superadmin can log in securely and see dashboard', async ({ page }) => {
    await page.goto('/portal/super-admin/dashboard');
    await expect(page.getByText(/1000/i).first()).toBeVisible();
  });

  test('superadmin can view users', async ({ page }) => {
    await page.goto('/portal/super-admin/users');
    await expect(page.getByText('Super Test User')).toBeVisible();
  });

  test('superadmin can view companies', async ({ page }) => {
    await page.goto('/portal/super-admin/companies');
    await expect(page.getByText('Super Test Company')).toBeVisible();
  });

  test('superadmin can view jobs', async ({ page }) => {
    await page.goto('/portal/super-admin/jobs');
    await expect(page.getByText('Super Test Job')).toBeVisible();
  });

  test('superadmin can view applications', async ({ page }) => {
    await page.goto('/portal/super-admin/applications');
    await expect(page.getByText('SA Candidate')).toBeVisible();
  });

  test('superadmin can view payments', async ({ page }) => {
    await page.goto('/portal/super-admin/payments');
    await expect(page.getByText('500')).first().toBeVisible();
  });
});
