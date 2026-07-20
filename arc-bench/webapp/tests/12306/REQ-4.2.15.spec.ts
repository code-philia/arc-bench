import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.15
// fixtures: orders_history_user

test('REQ-4.2.15: Filter history orders by ride date range', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersHistoryUser);
  await h.clickNamed(page, 'History orders');
  await h.expectTextsVisible(page, ['Search by booking date', 'Search by departure date', 'Search']);
});
