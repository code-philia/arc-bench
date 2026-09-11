import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.4
// fixtures: accounts.orderHistory, order_history

test('REQ-8.5.4: Download Invoice', async ({ page }) => {
  await h.openOrderHistory(page, h.FIXTURES.accounts.orderHistory);
  const download = await h.awaitDownload(() => h.clickFirstAvailable(page, [[/pdf/i]]), page);
  await expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
});
