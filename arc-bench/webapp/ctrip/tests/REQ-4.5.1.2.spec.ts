import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1.2
// fixtures: order_cancel_account, cancellation_order

test('REQ-4.5.1.2: Cancel a Pending Payment Order', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderCancel);
  await h.clickFirstAvailable(page, [[/待支付/, /pending payment/i]]);
  await h.clickFirstAvailable(page, [[/取消订单/, /cancel order/i, /取消/]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/已关闭/, /cancelled/i, /closed/i]]);
});
