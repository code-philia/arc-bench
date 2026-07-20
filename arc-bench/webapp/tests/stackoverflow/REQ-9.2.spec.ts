import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.2
// fixtures: elevated_user, activity_profile

test('REQ-9.2: Activity Sidebar Navigation', async ({ page }) => {
  await h.openActivityTab(page);
  await h.clickFirstAvailable(page, [[/^answers$/i]]);
  await h.expectTextsVisible(page, [/answers/i]);
  await h.clickFirstAvailable(page, [[/^questions$/i]]);
  await h.expectTextsVisible(page, [/questions/i]);
});
