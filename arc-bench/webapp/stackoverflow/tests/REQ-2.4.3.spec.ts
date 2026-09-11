import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.3
// fixtures: public_homepage

test('REQ-2.4.3: Invalid Email Format', async ({ page }) => {
  await h.openLoginPage(page);
  await h.fillField(page, [/email/i], h.FIXTURES.auth.invalidEmail);
  await h.clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
  await h.expectTextsVisible(page, [/not a valid email address/i]);
});
