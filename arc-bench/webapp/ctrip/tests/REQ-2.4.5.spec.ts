import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.5
// fixtures: password_login_account

test('REQ-2.4.5: Exception: Agreement Not Accepted', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillPasswordLogin(page, h.FIXTURES.accounts.passwordLogin.email, h.FIXTURES.accounts.passwordLogin.password, false);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请先阅读并勾选协议/, /agree/i, /terms/i]);
});
