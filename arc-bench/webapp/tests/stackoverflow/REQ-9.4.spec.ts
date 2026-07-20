import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.4
// fixtures: elevated_user, activity_profile

test('REQ-9.4: User Questions History', async ({ page }) => {
  await h.openActivityTab(page);
  await h.clickFirstAvailable(page, [[/^questions$/i]]);
  await h.expectTextsVisible(page, [/votes/i, /answers/i, /views/i]);
});
