import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1
// fixtures: elevated_user, activity_profile

test('REQ-8.1: View Reputation History', async ({ page }) => {
  await h.openActivityTab(page);
  await h.clickFirstAvailable(page, [[/^reputation$/i]]);
  await h.expectTextsVisible(page, [/answer upvoted/i, /question upvoted/i, /\+10|\+5/i]);
});
