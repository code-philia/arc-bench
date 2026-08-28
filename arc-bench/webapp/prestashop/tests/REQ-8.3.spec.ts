import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.3
// fixtures: accounts.profile

test('REQ-8.3: Account Information Management', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.profile);
  await h.clickFirstAvailable(page, [[/information/i]]);
  await h.expectTextsVisible(page, [/first name/i, /last name/i, /password/i]);
  await h.fillField(page, [/email/i], h.FIXTURES.accounts.profile.newEmail);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [/updated|saved|success/i]);
  await h.fillField(page, [/new password/i, /password/i], h.FIXTURES.accounts.profile.newPassword);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [/updated|saved|success/i]);
});
