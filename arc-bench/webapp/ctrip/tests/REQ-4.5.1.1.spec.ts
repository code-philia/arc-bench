import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1.1
// fixtures: order_read_account, order_read_dataset

test('REQ-4.5.1.1: Pending Payment Countdown', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.clickFirstAvailable(page, [[/待支付/, /pending payment/i]]);
  await h.clickFirstAvailable(page, [[/查看详情/, /订单详情/, /details/i]]);
  await h.expectAnyVisible(page, [[/建议在/, /complete payment/i], [/剩余时间/, /countdown/i]]);
});
