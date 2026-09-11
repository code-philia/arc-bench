import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2
// fixtures: accounts.login

test('REQ-7.2: User Login', async ({ page }) => {
  await h.openSignIn(page);
  await h.fillField(page, [/email/i], h.FIXTURES.accounts.login.email);
  await h.fillField(page, [/password/i], h.FIXTURES.accounts.login.password);
  await h.expectFieldValue(page, [/password/i], /.+/);
  await h.clickFirstAvailable(page, [[/show/i]]);
  await h.expectTextsVisible(page, [/hide/i, /remember me/i]);
  await h.setCheckbox(page, [/remember me/i], true);
  await h.clickFirstAvailable(page, [[/sign in/i]]);
  await h.expectTextsVisible(page, [/my account|sign out|store/i]);
});
