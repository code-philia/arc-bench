import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.5
// fixtures: public_homepage

test('REQ-2.2.5: Submit the login form with an unknown account', async ({ page }) => {
  await h.openLoginPage(page);
  await h.fillLoginForm(page, 'unknown_account', h.FIXTURES.registeredUser.password);
  await h.clickNamed(page, 'LOGIN');
  await h.expectErrorFeedback(page, 'User not found.');
});
