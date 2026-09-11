import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.3
// fixtures: public_homepage, registration_candidate

test('REQ-2.5.3: Weak Password', async ({ page }) => {
  await h.openSignupPage(page);
  await h.fillField(page, [/email/i], h.FIXTURES.auth.weakPasswordEmail);
  await h.fillField(page, [/password/i], h.FIXTURES.auth.weakPassword);
  await h.clickFirstAvailable(page, [[/^sign up$/i]]);
  await h.expectTextsVisible(page, [/minimum 8 characters|password requirements/i]);
});
