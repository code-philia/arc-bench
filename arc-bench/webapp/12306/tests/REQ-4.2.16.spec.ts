import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.16
// fixtures: orders_history_user

test('REQ-4.2.16: Search history orders with a valid keyword', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersHistoryUser);
  await h.clickNamed(page, 'History orders');
  await h.fillField(page, 'Order number/train number/name', h.FIXTURES.orderKeyword);
  await h.clickNamed(page, 'Search');
  await h.expectTextsVisible(page, [h.FIXTURES.orderKeyword]);
});

test('REQ-4.2.16: Reject an invalid history orders search condition', async ({ page }) => {
  await h.resetTestDatabase(page);
  await h.openTicketOrders(page, h.FIXTURES.ordersHistoryUser);
  await h.clickNamed(page, 'History orders');
  await h.fillField(page, 'Order number/train number/name', '***');
  await h.clickNamed(page, 'Search');
  await h.expectErrorFeedback(page, 'Please enter a valid search condition.');
});
