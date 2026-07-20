import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.1
// fixtures: public_homepage, sms_login_account

test('REQ-2.5.1: Verification-Code Login Flow', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.auth.smsMobile);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.expectAnyVisible(page, [[/倒计时/, /重新发送/, /countdown/i, /resend/i]]);
  await h.fillField(page, [/验证码/, /verification code/i], h.FIXTURES.auth.smsCode);
  await h.setAgreement(page, true);
  await h.submitLogin(page);
  await h.expectLoggedInState(page);
});
