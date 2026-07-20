import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.4.1
// fixtures: public_homepage, registration_candidate

test('REQ-2.6.4.1: Set Password and Complete Registration', async ({ page }) => {
  await h.reachRegistrationPasswordStep(page);
  await h.fillField(page, [/设置密码/, /登录密码/, /password/i], h.FIXTURES.registration.password);
  await h.fillField(page, [/确认密码/, /confirm/i], h.FIXTURES.registration.password);
  await h.clickFirstAvailable(page, [[/完成注册/, /complete registration/i, /register/i]]);
  await h.expectAnyVisible(page, [[/注册成功/, /success/i], [/登录/, /^login$/i]]);
});
