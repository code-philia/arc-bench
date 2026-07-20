import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.5
// fixtures: public_homepage, sms_login_account

test('REQ-2.5.5: Exception: Agreement Not Accepted', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.auth.smsMobile);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.fillField(page, [/验证码/, /verification code/i], h.FIXTURES.auth.smsCode);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请先阅读并勾选协议/, /agree/i, /terms/i]);
});
