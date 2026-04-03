import test from 'node:test';
import assert from 'node:assert/strict';
import { footerSocialLinks } from '../../src/shared/components/layout/publicShell/footer/footerSocialLinks.js';
import { getPublicNavItems } from '../../src/shared/components/layout/publicShell/publicNavigation.js';

test('footer quick links avoid placeholder targets', () => {
  assert.equal(footerSocialLinks.some((item) => item.href === '#'), false);
  assert.deepEqual(
    footerSocialLinks.map((item) => item.href),
    ['/contact-us', '/careers', '/blog', 'mailto:support@hhh-jobs.com']
  );
});

test('public navigation wires the expected core destinations', () => {
  const navItems = getPublicNavItems({
    jobSeekerPath: '/login',
    jobsNavPath: '/portal/student/jobs',
    recruiterPath: '/employer-home'
  });

  const jobsItem = navItems.find((item) => item.key === 'jobs');
  const companyItem = navItems.find((item) => item.key === 'companies');
  const forYouItem = navItems.find((item) => item.key === 'for-you');

  assert.equal(jobsItem?.to, '/portal/student/jobs');
  assert.equal(companyItem?.to, '/employer-home');
  assert.equal(forYouItem?.children?.find((item) => item.key === 'for-freshers')?.to, '/sign-up');
});
