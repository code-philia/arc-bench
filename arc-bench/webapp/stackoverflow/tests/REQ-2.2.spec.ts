import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2
// fixtures: registered_user, profile_summary

test('REQ-2.2: Authenticated Session', async ({ page }) => {
  await h.login(page);
  await h.expectTextsVisible(page, [/profile/i, /stack user/i]);
});
