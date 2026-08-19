import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: personal_center_user

test('REQ-5.1: Enter Personal Center', async ({ page }) => {
  await h.openPersonalCenter(page);
  await h.expectPersonalCenter(page);
});
