import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.3
// fixtures: elevated_user, activity_profile

test('REQ-9.3: User Answers History', async ({ page }) => {
  await h.openActivityTab(page);
  await h.clickFirstAvailable(page, [[/^answers$/i]]);
  await h.expectTextsVisible(page, [/score/i, /activity/i, /newest/i]);
});
