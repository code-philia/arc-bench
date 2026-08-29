import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2.3
// fixtures: order_read_account, order_read_dataset

test('REQ-4.4.2.3: Switch to Pending Review', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.clickFirstAvailable(page, [[/待点评/, /pending review/i]]);
  await h.expectAnyVisible(page, [[/待点评/, /pending review/i]]);
});
