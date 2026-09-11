import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.5
// fixtures: accounts.activity, activity.profile

test('REQ-9.5: Reputation and Engagement Tracking', async ({ page }) => {
  await h.openActivityTab(page, h.FIXTURES.accounts.activity);
  await h.clickFirstAvailable(page, [[/^reputation$/i]]);
  await h.expectTextsVisible(page, [/reputation/i, /vote/i]);
});
