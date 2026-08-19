import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.2
// fixtures: public_homepage, registration_candidate, registered_user

test('REQ-2.5.2: Email Already Registered', async ({ page }) => {
  await h.openSignupPage(page);
  await h.fillField(page, [/email/i], h.FIXTURES.auth.email);
  await h.fillField(page, [/password/i], h.FIXTURES.auth.password);
  await h.clickFirstAvailable(page, [[/^sign up$/i]]);
  await h.expectTextsVisible(page, [/already in use/i]);
});
