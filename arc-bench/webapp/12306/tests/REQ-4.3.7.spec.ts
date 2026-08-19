import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.7
// fixtures: profile_user

test('REQ-4.3.7: Save a valid security mailbox update', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await h.fillField(page, 'Email', h.FIXTURES.profileUser.newEmail);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.7: Reject a security mailbox update with missing fields', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await h.fillField(page, 'Email', h.FIXTURES.profileUser.newEmail);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.7: Reject a security mailbox update with an incorrect password', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await h.fillField(page, 'Email', h.FIXTURES.profileUser.newEmail);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.7: Reject a security mailbox update with an invalid email address', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await h.fillField(page, 'Email', h.FIXTURES.profileUser.newEmail);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});
