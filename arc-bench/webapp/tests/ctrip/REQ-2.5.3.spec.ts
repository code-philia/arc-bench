import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.3
// fixtures: public_homepage, sms_login_account

test('REQ-2.5.3: Exception: Verification Code Missing', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.auth.smsMobile);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.setAgreement(page, true);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请输入验证码/, /verification code/i]);
});
