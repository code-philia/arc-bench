import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.2
// fixtures: accounts.activity, activity.profile

test('REQ-9.2: Activity Sidebar Navigation', async ({ page }) => {
  await h.openActivityTab(page, h.FIXTURES.accounts.activity);
  await h.clickFirstAvailable(page, [[/^answers$/i]]);
  await h.expectTextsVisible(page, [/answers/i]);
  await h.clickFirstAvailable(page, [[/^questions$/i]]);
  await h.expectTextsVisible(page, [/questions/i]);
});
