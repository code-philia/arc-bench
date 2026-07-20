import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.8
// fixtures: profile_user

test('REQ-4.3.8: Save a valid mobile number update', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Mobile number');
  await h.fillField(page, 'Mobile number', h.FIXTURES.profileUser.newMobile);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.8: Reject a mobile number update with missing fields', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Mobile number');
  await h.fillField(page, 'Mobile number', h.FIXTURES.profileUser.newMobile);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.8: Reject a mobile number update with an incorrect password', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Mobile number');
  await h.fillField(page, 'Mobile number', h.FIXTURES.profileUser.newMobile);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});

test('REQ-4.3.8: Reject a mobile number update with an invalid mobile number', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.clickNamed(page, 'Mobile number');
  await h.fillField(page, 'Mobile number', h.FIXTURES.profileUser.newMobile);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
});
