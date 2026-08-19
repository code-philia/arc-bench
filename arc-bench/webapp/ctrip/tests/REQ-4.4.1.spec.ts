import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: order_center_user, order_center_dataset

test('REQ-4.4.1: Enter Order Center', async ({ page }) => {
  await h.openOrderCenter(page);
  await h.expectAnyVisible(page, [[/订单/, /orders/i]]);
});
