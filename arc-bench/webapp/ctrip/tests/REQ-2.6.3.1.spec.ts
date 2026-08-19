import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.3.1
// fixtures: public_homepage, registration_candidate

test('REQ-2.6.3.1: Enter Verification Information', async ({ page }) => {
  await h.reachRegistrationVerifyStep(page);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.registration.mobile);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.expectAnyVisible(page, [[/倒计时/, /重新发送/, /countdown/i, /resend/i]]);
  await h.fillField(page, [/验证码/, /verification code/i], h.FIXTURES.registration.code);
  await h.clickFirstAvailable(page, [[/下一步/, /设置密码/, /next/i]]);
  await h.expectAnyVisible(page, [[/设置密码/, /password/i], [/确认密码/, /confirm/i]]);
});
