import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.3
// fixtures: public_homepage, registered_account

test('REQ-2.4.3: Exception: Password Missing', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillField(page, [/邮箱.*用户名.*手机号/, /email.*username.*mobile/i, /account/i], h.FIXTURES.auth.username);
  await h.setAgreement(page, true);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请输入登录密码/, /password/i]);
});
