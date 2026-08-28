import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.1
// fixtures: accounts.activity, activity.profile

test('REQ-9.1: View Activity Tab', async ({ page }) => {
  await h.openActivityTab(page, h.FIXTURES.accounts.activity);
  await h.expectTextsVisible(page, [/activity/i, /summary/i, /answers|questions|responses/i]);
});
