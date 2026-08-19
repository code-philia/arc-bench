import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.4
// fixtures: public_homepage, sms_login_account

test('REQ-2.5.4: Exception: Incorrect Verification Code', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.auth.smsMobile);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.fillField(page, [/验证码/, /verification code/i], '000000');
  await h.setAgreement(page, true);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/验证码错误/, /incorrect code/i]);
});
