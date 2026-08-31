import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.6
// fixtures: security_password_user, profile_user

test('REQ-4.3.6: Save a valid password change from the account security page', async ({ page }) => {
  const account = h.FIXTURES.securityPasswordUser;
  await h.openAccountSecurity(page, account);
  await h.openSecurityForm(page, 'Login password', 'Current password');
  await h.fillField(page, 'Current password', account.password);
  await h.fillField(page, 'New password', account.newPassword);
  await h.fillField(page, 'Confirm your password', account.newPassword);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
  await h.signOutAndOpenLogin(page);
  await h.fillLoginForm(page, account.username, account.newPassword);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
});

test('REQ-4.3.6: Reject a password change with missing fields', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Login password', 'Current password');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Please fill in all password fields.');
});

test('REQ-4.3.6: Reject a password change with an incorrect current password', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Login password', 'Current password');
  await h.fillField(page, 'Current password', 'WrongPassword123!');
  await h.fillField(page, 'New password', h.FIXTURES.profileUser.newPassword);
  await h.fillField(page, 'Confirm your password', h.FIXTURES.profileUser.newPassword);
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Incorrect current password.');
});

test('REQ-4.3.6: Reject a password change with mismatched new passwords', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Login password', 'Current password');
  await h.fillField(page, 'Current password', h.FIXTURES.profileUser.password);
  await h.fillField(page, 'New password', h.FIXTURES.profileUser.newPassword);
  await h.fillField(page, 'Confirm your password', 'Password123!Mismatch');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'New passwords do not match.');
});
