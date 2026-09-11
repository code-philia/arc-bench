import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.4.2
// fixtures: registration_password_mismatch_state

test('REQ-2.6.4.2: Exception: Passwords Do Not Match', async ({ page }) => {
  await h.reachRegistrationPasswordStep(page, h.FIXTURES.registration.mismatch);
  await h.fillField(page, [/设置密码/, /登录密码/, /password/i], h.FIXTURES.registration.mismatch.password);
  await h.fillField(page, [/确认密码/, /confirm/i], 'Travel5678');
  await h.clickFirstAvailable(page, [[/完成注册/, /complete registration/i, /register/i]]);
  await h.expectErrorFeedback(page, [/两次输入的密码不一致/, /do not match/i]);
});
