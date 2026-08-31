import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.8
// fixtures: profile_user

test('REQ-4.3.8: Save a valid mobile number update', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Mobile number', 'new mobile number');
  await page.getByPlaceholder('new mobile number.').fill(h.FIXTURES.profileUser.newMobile);
  await page.getByPlaceholder('Please enter the login password.').fill(h.FIXTURES.profileUser.password);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.8: Reject a mobile number update with missing fields', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Mobile number', 'new mobile number');
  await page.getByPlaceholder('new mobile number.').fill('');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Please fill in the new mobile number and password.');
});

test('REQ-4.3.8: Reject a mobile number update with an incorrect password', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Mobile number', 'new mobile number');
  await page.getByPlaceholder('new mobile number.').fill(h.FIXTURES.profileUser.newMobile);
  await page.getByPlaceholder('Please enter the login password.').fill('WrongPassword123!');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Incorrect password.');
});

test('REQ-4.3.8: Reject a mobile number update with an invalid mobile number', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.openSecurityForm(page, 'Mobile number', 'new mobile number');
  await page.getByPlaceholder('new mobile number.').fill('123');
  await page.getByPlaceholder('Please enter the login password.').fill(h.FIXTURES.profileUser.password);
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Invalid mobile number format.');
});
