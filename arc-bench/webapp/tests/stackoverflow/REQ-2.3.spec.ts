import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3
// fixtures: elevated_user, activity_profile

test('REQ-2.3: Elevated Privileges', async ({ page }) => {
  await h.openActivityTab(page);
  await h.expectTextsVisible(page, [/reputation/i, /votes/i, /responses/i]);
});
