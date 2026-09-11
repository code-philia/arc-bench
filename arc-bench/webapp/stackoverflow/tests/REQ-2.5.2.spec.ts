import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.2
// fixtures: public_homepage, accounts.readonly

test('REQ-2.5.2: Email Already Registered', async ({ page }) => {
  await h.openSignupPage(page);
  await h.fillField(page, [/email/i], h.FIXTURES.accounts.readonly.email);
  await h.fillField(page, [/password/i], h.FIXTURES.accounts.readonly.password);
  await h.clickFirstAvailable(page, [[/^sign up$/i]]);
  await h.expectTextsVisible(page, [/already in use/i]);
});
