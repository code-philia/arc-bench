import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.3
// fixtures: accounts.activity, activity.profile

test('REQ-9.3: User Answers History', async ({ page }) => {
  await h.openActivityTab(page, h.FIXTURES.accounts.activity);
  await h.clickFirstAvailable(page, [[/^answers$/i]]);
  await h.expectTextsVisible(page, [/score/i, /activity/i, /newest/i]);
});
