import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.5
// fixtures: elevated_user, activity_profile

test('REQ-9.5: Reputation and Engagement Tracking', async ({ page }) => {
  await h.openActivityTab(page);
  await h.clickFirstAvailable(page, [[/^reputation$/i]]);
  await h.expectTextsVisible(page, [/reputation/i, /vote/i]);
});
