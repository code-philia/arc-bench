import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.1
// fixtures: public_homepage, registration_candidate

test('REQ-2.5.1: Successful Sign Up', async ({ page }) => {
  await h.openSignupPage(page);
  await h.expectTextsVisible(page, [/join stack overflow/i, /email/i, /password/i]);
  await h.fillField(page, [/email/i], h.FIXTURES.auth.signupEmail);
  await h.fillField(page, [/password/i], h.FIXTURES.accounts.readonly.password);
  await h.clickFirstAvailable(page, [[/^sign up$/i]]);
  await h.expectTextsVisible(page, [/profile/i, /questions/i]);
});
