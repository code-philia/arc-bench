import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.4
// fixtures: public_homepage, registered_user

test('REQ-2.4.4: Unregistered Email', async ({ page }) => {
  await h.openLoginPage(page);
  await h.fillField(page, [/email/i], h.FIXTURES.auth.unknownEmail);
  await h.fillField(page, [/password/i], h.FIXTURES.auth.password);
  await h.clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
  await h.expectTextsVisible(page, [/no account found/i]);
});
