import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.1
// fixtures: public_homepage, registered_user

test('REQ-2.2.1: Open the login page from the home page', async ({ page }) => {
  await h.openLoginPage(page);
  await h.expectLoginForm(page);
});
