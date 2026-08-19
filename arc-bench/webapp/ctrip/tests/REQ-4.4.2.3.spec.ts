import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2.3
// fixtures: order_center_user, order_center_dataset

test('REQ-4.4.2.3: Switch to Pending Review', async ({ page }) => {
  await h.openOrderCenter(page);
  await h.clickFirstAvailable(page, [[/待点评/, /pending review/i]]);
  await h.expectAnyVisible(page, [[/待点评/, /pending review/i]]);
});
