import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6
// fixtures: accounts.readonly, profile.summary

test('REQ-2.6: View User Profile', async ({ page }) => {
  await h.openProfile(page, h.FIXTURES.accounts.readonly);
  await h.expectTextsVisible(page, [/activity/i, /summary/i, /reputation/i, /recent/i]);
});
