import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.4
// fixtures: accounts.activity, activity.profile

test('REQ-9.4: User Questions History', async ({ page }) => {
  await h.openActivityTab(page, h.FIXTURES.accounts.activity);
  await h.clickFirstAvailable(page, [[/^questions$/i]]);
  await h.expectTextsVisible(page, [/votes/i, /answers/i, /views/i]);
});
