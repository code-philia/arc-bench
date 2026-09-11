import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.5.1
// fixtures: phone_binding_account, phone_binding_state

test('REQ-6.5.1: Verify Identity and Bind New Phone', async ({ page }) => {
  await h.openSecurityCenter(page, h.FIXTURES.accounts.phoneBinding);
  await h.clickFirstAvailable(page, [[/手机号/, /phone/i, /修改/]]);
  await h.expectAnyVisible(page, [[/验证身份/, /verify identity/i]]);
  await h.fillField(page, [/新手机号/, /new phone/i], h.FIXTURES.profile.newPhone);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.expectAnyVisible(page, [[/验证码/, /verification code/i], [/下一步/, /next/i]]);
});
