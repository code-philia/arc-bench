import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2.4
// fixtures: order_read_account, order_read_dataset

test('REQ-4.4.2.4: Switch to All Orders', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.clickFirstAvailable(page, [[/全部订单/, /all orders/i]]);
  await h.expectAnyVisible(page, [[/全部订单/, /all orders/i], [/订单号/, /order number/i]]);
});
