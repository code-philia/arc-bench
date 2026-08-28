import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.7
// fixtures: profile_user

test('REQ-4.3.7: Save a valid security mailbox update', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await page.getByPlaceholder('Please enter a new email address.').fill(h.FIXTURES.profileUser.newEmail);
  await page.getByPlaceholder('Correct password input to modify personal information.').fill(h.FIXTURES.profileUser.password);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
  await page.evaluate(() => localStorage.removeItem('train-user'));
  await page.goto('/login');
  await h.fillLoginForm(page, h.FIXTURES.profileUser.newEmail, h.FIXTURES.profileUser.password);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
});

test('REQ-4.3.7: Reject a security mailbox update with missing fields', async ({ page }) => {
  await h.resetTestDatabase(page);
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await page.getByPlaceholder('Please enter a new email address.').fill('');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Please fill in the new email and password.');
});

test('REQ-4.3.7: Reject a security mailbox update with an incorrect password', async ({ page }) => {
  await h.resetTestDatabase(page);
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await page.getByPlaceholder('Please enter a new email address.').fill(h.FIXTURES.profileUser.newEmail);
  await page.getByPlaceholder('Correct password input to modify personal information.').fill('WrongPassword123!');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Incorrect password.');
});

test('REQ-4.3.7: Reject a security mailbox update with an invalid email address', async ({ page }) => {
  await h.resetTestDatabase(page);
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Security mailbox');
  await page.getByPlaceholder('Please enter a new email address.').fill('invalid-email');
  await page.getByPlaceholder('Correct password input to modify personal information.').fill(h.FIXTURES.profileUser.password);
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Invalid email address format.');
});
