import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.4
// fixtures: accounts.login

test('REQ-7.4: Forgot Password', async ({ page }) => {
  await h.openSignIn(page);
  await h.clickFirstAvailable(page, [[/forgot your password\?/i]]);
  await h.expectTextsVisible(page, [/reset password|password reset/i]);
  await h.fillField(page, [/email/i], h.FIXTURES.accounts.login.email);
  await h.clickFirstAvailable(page, [[/send/i, /retrieve/i]]);
  await h.expectTextsVisible(page, [/email sent|reset link|success/i]);
});
