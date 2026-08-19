import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.2
// fixtures: public_homepage, registered_user

test('REQ-2.4.2: Empty Credentials', async ({ page }) => {
  await h.openLoginPage(page);
  await h.clickFirstAvailable(page, [[/^log in$/i, /^login$/i]]);
  await h.expectTextsVisible(page, [/email cannot be empty/i, /password cannot be empty/i]);
});
