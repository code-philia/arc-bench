import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.5
// fixtures: sms_agreement_account, sms_verification_code

test('REQ-2.5.5: Exception: Agreement Not Accepted', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.accounts.smsAgreement.mobile);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.fillField(page, [/验证码/, /verification code/i], h.FIXTURES.accounts.smsAgreement.verificationCode);
  await h.submitLogin(page);
  await h.expectErrorFeedback(page, [/请先阅读并勾选协议/, /agree/i, /terms/i]);
});
