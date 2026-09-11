import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.2
// fixtures: accounts.orderHistory, order_history

test('REQ-8.5.2: View Order Details', async ({ page }) => {
  await h.openOrderHistory(page, h.FIXTURES.accounts.orderHistory);
  await h.clickFirstAvailable(page, [[/details/i]]);
  await h.expectTextsVisible(page, [/shipping/i, /payment/i, /product/i]);
});
