import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.3
// fixtures: registered_user, personal_center_user

test('REQ-4.1.3: Open the default ticket search from the personal center notice link', async ({ page }) => {
  await h.openPersonalCenter(page);
  await h.clickNamed(page, /Search/i);
  await h.expectQuickSearch(page);
});
