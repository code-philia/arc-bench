import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.5
// fixtures: public_homepage, accounts.readonly

test('REQ-2.4.5: Incorrect Password', async ({ page }) => {
  await h.openLoginPage(page);
  await h.fillField(page, [/email/i], h.FIXTURES.accounts.readonly.email);
  await h.fillField(page, [/password/i], h.FIXTURES.auth.wrongPassword);
  await h.clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
  await h.expectTextsVisible(page, [/does not match any account/i]);
});
