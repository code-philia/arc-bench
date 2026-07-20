import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.6
// fixtures: public_homepage, registered_user

test('REQ-2.2.6: Submit the login form with an incorrect password', async ({ page }) => {
  await h.openLoginPage(page);
  await h.fillLoginForm(page, h.FIXTURES.registeredUser.username!, 'WrongPassword123!');
  await h.clickNamed(page, 'LOGIN');
  await h.expectErrorFeedback(page, 'Incorrect password.');
});
