import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.6
// fixtures: elevated_user, activity_profile

test('REQ-9.6: User Responses and Comments', async ({ page }) => {
  await h.openActivityTab(page);
  await h.clickFirstAvailable(page, [[/^responses$/i]]);
  await h.expectTextsVisible(page, [/comment/i, /reply/i, /question|answer/i]);
});
