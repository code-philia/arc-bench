import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.4.2
// fixtures: public_homepage, registration_candidate

test('REQ-2.6.4.2: Exception: Passwords Do Not Match', async ({ page }) => {
  await h.reachRegistrationPasswordStep(page);
  await h.fillField(page, [/设置密码/, /登录密码/, /password/i], h.FIXTURES.registration.password);
  await h.fillField(page, [/确认密码/, /confirm/i], 'Travel5678');
  await h.clickFirstAvailable(page, [[/完成注册/, /complete registration/i, /register/i]]);
  await h.expectErrorFeedback(page, [/两次输入的密码不一致/, /do not match/i]);
});
