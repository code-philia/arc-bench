import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.7
// fixtures: registered_user

test('REQ-8.7: User Logout', async ({ page }) => {
  await h.openMyAccount(page);
  await h.clickFirstAvailable(page, [[/sign out/i, /logout/i]]);
  await h.expectHome(page);
});
