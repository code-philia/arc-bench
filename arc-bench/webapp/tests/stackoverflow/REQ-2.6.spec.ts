import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6
// fixtures: registered_user, profile_summary

test('REQ-2.6: View User Profile', async ({ page }) => {
  await h.openProfile(page);
  await h.expectTextsVisible(page, [/activity/i, /summary/i, /reputation/i, /recent/i]);
});
