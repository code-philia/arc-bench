import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.2.1
// fixtures: public_homepage

test('REQ-2.6.2.1: Trigger Registration Agreement', async ({ page }) => {
  await h.beginRegistrationFromLogin(page);
  await h.expectRegistrationAgreement(page);
  await h.clickFirstAvailable(page, [[/同意并继续/, /agree and continue/i]]);
  await h.expectAnyVisible(page, [[/手机号/, /mobile/i], [/验证码/, /verification code/i], [/设置密码/, /password/i, /下一步/, /next/i]]);
});
