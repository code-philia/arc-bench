import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.4.3
// fixtures: registration_weak_password_state

test('REQ-2.6.4.3: Exception: Password Too Weak', async ({ page }) => {
  await h.reachRegistrationPasswordStep(page, h.FIXTURES.registration.weak);
  await h.fillField(page, [/设置密码/, /登录密码/, /password/i], h.FIXTURES.registration.weak.weakPassword!);
  await h.fillField(page, [/确认密码/, /confirm/i], h.FIXTURES.registration.weak.weakPassword!);
  await h.clickFirstAvailable(page, [[/完成注册/, /complete registration/i, /register/i]]);
  await h.expectErrorFeedback(page, [/密码需包含字母和数字/, /长度不小于8位/, /password/i]);
});
