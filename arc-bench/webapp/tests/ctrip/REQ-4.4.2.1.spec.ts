import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2.1
// fixtures: order_center_user, order_center_dataset

test('REQ-4.4.2.1: Switch to Pending Payment', async ({ page }) => {
  await h.openOrderCenter(page);
  await h.clickFirstAvailable(page, [[/待支付/, /pending payment/i]]);
  await h.expectAnyVisible(page, [[/待支付/, /pending payment/i], [/去支付/, /pay/i]]);
});
