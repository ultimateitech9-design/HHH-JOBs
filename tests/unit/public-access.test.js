import test from 'node:test';
import assert from 'node:assert/strict';

import {
  JOB_GATE_PORTAL_LABEL,
  getCompanyEntryIntent,
  getLoginRedirectState,
  getPublicJobsNavPath,
  shouldLockJobBoards
} from '../../src/modules/common/utils/publicAccess.js';

test('guests are sent through login before company job boards unlock', () => {
  const intent = getCompanyEntryIntent({
    companySlug: 'acme-industries',
    isAuthenticated: false,
    totalJobs: 6
  });

  assert.equal(intent.to, '/login');
  assert.equal(intent.tone, 'locked');
  assert.equal(intent.accessLabel, 'Private role board');
  assert.deepEqual(intent.state, {
    from: '/companies/acme-industries',
    portalLabel: JOB_GATE_PORTAL_LABEL
  });
});

test('authenticated users go straight to the company page', () => {
  const intent = getCompanyEntryIntent({
    companySlug: 'acme-industries',
    isAuthenticated: true,
    totalJobs: 6
  });

  assert.equal(intent.to, '/companies/acme-industries');
  assert.equal(intent.tone, 'active');
  assert.equal(intent.state, undefined);
});

test('jobs nav path stays locked until login', () => {
  assert.equal(getPublicJobsNavPath(false), '/login');
  assert.equal(getPublicJobsNavPath(true), '/jobs');
  assert.equal(shouldLockJobBoards(false), true);
  assert.equal(shouldLockJobBoards(true), false);
});

test('login redirect state preserves the return path and portal label', () => {
  assert.deepEqual(getLoginRedirectState('/companies/acme-industries'), {
    from: '/companies/acme-industries',
    portalLabel: JOB_GATE_PORTAL_LABEL
  });
});
