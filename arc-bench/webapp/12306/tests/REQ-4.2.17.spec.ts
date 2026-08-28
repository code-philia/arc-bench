import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.17
// fixtures: orders_history_user

test('REQ-4.2.17: Display historical orders in a table', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersHistoryUser);
  await h.clickNamed(page, 'History orders');
  await h.expectTextsVisible(page, ['Train Information', 'Passenger Information', 'Seat Information', 'Price', 'Status', 'Total Price']);
});
