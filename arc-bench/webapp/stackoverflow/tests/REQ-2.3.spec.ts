import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3
// fixtures: accounts.activity, activity.profile

test('REQ-2.3: Elevated Privileges', async ({ page }) => {
  await h.openActivityTab(page, h.FIXTURES.accounts.activity);
  await h.expectTextsVisible(page, [/reputation/i, /votes/i, /responses/i]);
});
