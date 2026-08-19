import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.7
// fixtures: public_homepage, registered_user

test('REQ-2.2.7: Open the registration page from the login page', async ({ page }) => {
  await h.openLoginPage(page);
  await h.clickNamed(page, /No account yet\? Register now\./i);
  await h.expectRegistrationForm(page);
});
