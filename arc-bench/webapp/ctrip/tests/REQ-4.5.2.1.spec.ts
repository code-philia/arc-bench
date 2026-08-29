import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2.1
// fixtures: order_read_account, order_read_dataset

test('REQ-4.5.2.1: View Refund/Change Rules', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.clickFirstAvailable(page, [[/查看详情/, /订单详情/, /details/i]]);
  await h.clickFirstAvailable(page, [[/退改签规则/, /refund/i, /change/i]]);
  await h.expectAnyVisible(page, [[/退票/, /refund/i], [/改签/, /change/i]]);
});
