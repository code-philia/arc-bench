import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.6.1
// fixtures: email_binding_account, email_binding_state, email_binding_verification_code

test('REQ-6.6.1: Email Verification Flow', async ({ page }) => {
  await h.openSecurityCenter(page, h.FIXTURES.accounts.emailBinding);
  await h.clickFirstAvailable(page, [[/邮箱/, /email/i, /修改/]]);
  await h.expectAnyVisible(page, [[/\*\*\*|\*\*\*\*/, /masked/i], [/发送验证码/, /send code/i]]);
  await h.fillField(page, [/验证码/, /verification code/i], h.FIXTURES.accounts.emailBinding.verificationCode);
  await h.clickFirstAvailable(page, [[/下一步/, /验证新邮箱/, /next/i]]);
  await h.expectAnyVisible(page, [[/新邮箱/, /new email/i]]);
});
