import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.3
// fixtures: public_homepage, registered_user

test('REQ-2.2.3: Log in with valid credentials', async ({ page }) => {
  await h.openLoginPage(page);
  await h.fillLoginForm(page, h.FIXTURES.registeredUser.username!, h.FIXTURES.registeredUser.password);
  await h.clickNamed(page, 'LOGIN');
  await h.expectSuccessFeedback(page);
});
