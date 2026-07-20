import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.1
// fixtures: elevated_user, activity_profile

test('REQ-9.1: View Activity Tab', async ({ page }) => {
  await h.openActivityTab(page);
  await h.expectTextsVisible(page, [/activity/i, /summary/i, /answers|questions|responses/i]);
});
