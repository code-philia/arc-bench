import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.1
// fixtures: profile_user

test('REQ-6.3.1: Enter Security Center', async ({ page }) => {
  await h.openSecurityCenter(page);
  await h.expectAnyVisible(page, [[/建议定期更换/, /regularly/i], [/登录密码/, /password/i], [/手机号/, /phone/i], [/邮箱/, /email/i]]);
});
