import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.1
// fixtures: public_homepage, accounts.readonly

test('REQ-2.4.1: Successful Login', async ({ page }) => {
  await h.openLoginPage(page);
  await h.expectTextsVisible(page, [/email/i, /password/i]);
  await h.fillField(page, [/email/i], h.FIXTURES.accounts.readonly.email);
  await h.fillField(page, [/password/i], h.FIXTURES.accounts.readonly.password);
  await h.clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
  await h.expectTextsVisible(page, [/profile/i, h.FIXTURES.accounts.readonly.displayName]);
});
