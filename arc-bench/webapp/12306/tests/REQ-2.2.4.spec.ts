import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.4
// fixtures: public_homepage, registered_user

test('REQ-2.2.4: Submit the login form with missing account information or password', async ({ page }) => {
  await h.openLoginPage(page);
  await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
  await h.expectErrorFeedback(page, 'Please enter your username/email/phone number and password.');
});
