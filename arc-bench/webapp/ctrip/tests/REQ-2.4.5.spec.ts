import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.5
// fixtures: public_homepage, registered_account

test('REQ-2.4.5: Exception: Agreement Not Accepted', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillPasswordLogin(page, h.FIXTURES.auth.username, h.FIXTURES.auth.password, false);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请先阅读并勾选协议/, /agree/i, /terms/i]);
});
