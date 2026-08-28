import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.1
// fixtures: accounts.orderHistory, order_history

test('REQ-8.5.1: View Order List', async ({ page }) => {
  await h.openOrderHistory(page, h.FIXTURES.accounts.orderHistory);
  await h.expectTextsVisible(page, [/reference/i, /date/i, /status/i, /total/i]);
});
