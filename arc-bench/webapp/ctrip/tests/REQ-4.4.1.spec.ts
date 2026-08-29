import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: order_read_account, order_read_dataset

test('REQ-4.4.1: Enter Order Center', async ({ page }) => {
  await h.openOrderCenter(page, h.FIXTURES.accounts.orderRead);
  await h.expectAnyVisible(page, [[/订单/, /orders/i]]);
});
