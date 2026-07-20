import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.4
// fixtures: public_homepage, registered_account

test('REQ-2.4.4: Exception: Incorrect Username or Password', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillPasswordLogin(page, h.FIXTURES.auth.username, 'WrongPass123', true);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/用户名或密码错误/, /incorrect/i, /invalid/i]);
});
