import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.4.1
// fixtures: order_read_account, order_read_dataset

test('REQ-4.4.4.1: View Order Details', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.clickFirstAvailable(page, [[/查看详情/, /订单详情/, /details/i]]);
  await h.expectAnyVisible(page, [[/订单详情/, /order details/i], [/订单号/, /order number/i]]);
});
