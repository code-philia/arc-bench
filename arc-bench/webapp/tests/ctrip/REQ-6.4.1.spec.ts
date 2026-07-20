import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.4.1
// fixtures: profile_user, security_profile

test('REQ-6.4.1: Standard Password Change Flow', async ({ page }) => {
  await h.openSecurityCenter(page);
  await h.clickFirstAvailable(page, [[/修改密码/, /change password/i, /登录密码/]]);
  await h.expectAnyVisible(page, [[/弱|中|强/, /weak|medium|strong/i]]);
  await h.fillField(page, [/原密码/, /current password/i], h.FIXTURES.auth.password);
  await h.fillField(page, [/新密码/, /new password/i], h.FIXTURES.auth.newPassword);
  await h.fillField(page, [/确认密码/, /confirm/i], h.FIXTURES.auth.newPassword);
  await h.clickFirstAvailable(page, [[/保存/, /确认/, /save/i, /confirm/i]]);
  await h.expectAnyVisible(page, [[/重新登录/, /re-login/i, /登录/]]);
});
