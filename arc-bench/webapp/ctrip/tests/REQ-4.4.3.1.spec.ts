import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.3.1
// fixtures: order_read_account, order_read_dataset

test('REQ-4.4.3.1: Search Historical Orders', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.fillField(page, [/订单号/, /订单搜索/, /order/i], h.FIXTURES.booking.orderNumber);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectVisible(page, h.FIXTURES.booking.orderNumber);
});
