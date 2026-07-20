import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.2
// fixtures: public_homepage, registered_account

test('REQ-2.4.2: Exception: Username Missing', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillField(page, [/密码/, /password/i], h.FIXTURES.auth.password);
  await h.setAgreement(page, true);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请输入用户名/, /account/i, /username/i]);
});
