import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2.2
// fixtures: order_center_user, order_center_dataset

test('REQ-4.4.2.2: Switch to Not Traveled', async ({ page }) => {
  await h.openOrderCenter(page);
  await h.clickFirstAvailable(page, [[/未出行/, /not traveled/i]]);
  await h.expectAnyVisible(page, [[/未出行/, /not traveled/i], [/暂时没有相关订单/, /no relevant orders/i]]);
});
