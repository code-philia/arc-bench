import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2
// fixtures: accounts.readonly, profile.summary

test('REQ-2.2: Authenticated Session', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.readonly);
  await h.expectTextsVisible(page, [/profile/i, h.FIXTURES.accounts.readonly.displayName]);
});
