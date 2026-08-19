import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.6
// fixtures: profile_user

test('REQ-4.3.6: Save a valid password change from the account security page', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Login password');
  await h.fillField(page, 'Current password', h.FIXTURES.profileUser.password);
  await h.fillField(page, 'New password', h.FIXTURES.profileUser.newPassword);
  await h.fillField(page, 'Confirm your password', h.FIXTURES.profileUser.newPassword);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.6: Reject a password change with missing fields', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Login password');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Please fill in all password fields.');
});

test('REQ-4.3.6: Reject a password change with an incorrect current password', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Login password');
  await h.fillField(page, 'Current password', 'WrongPassword123!');
  await h.fillField(page, 'New password', h.FIXTURES.profileUser.newPassword);
  await h.fillField(page, 'Confirm your password', h.FIXTURES.profileUser.newPassword);
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Incorrect current password.');
});

test('REQ-4.3.6: Reject a password change with mismatched new passwords', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Login password');
  await h.fillField(page, 'Current password', h.FIXTURES.profileUser.password);
  await h.fillField(page, 'New password', h.FIXTURES.profileUser.newPassword);
  await h.fillField(page, 'Confirm your password', 'Password123!Mismatch');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'New passwords do not match.');
});
