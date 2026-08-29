import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.1
// fixtures: password_login_account

test('REQ-2.4.1: Password Login Flow', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillPasswordLogin(page, h.FIXTURES.accounts.passwordLogin.email, h.FIXTURES.accounts.passwordLogin.password, true);
  await h.submitLogin(page);
  await h.expectLoggedInState(page);
});
