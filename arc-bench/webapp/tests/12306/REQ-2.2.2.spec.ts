import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.2
// fixtures: public_homepage, registered_user

test('REQ-2.2.2: Display the login form layout', async ({ page }) => {
  await h.openLoginPage(page);
  await h.expectLoginForm(page);
});
