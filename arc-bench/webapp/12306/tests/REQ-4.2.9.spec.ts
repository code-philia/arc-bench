import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.9
// fixtures: orders_upcoming_user

test('REQ-4.2.9: Search upcoming trips with a valid keyword', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.fillField(page, 'Order number/train number/name', '***');
  await h.clickNamed(page, 'Search');
  await h.expectErrorFeedback(page, 'Please enter a valid search condition.');
});

test('REQ-4.2.9: Reject an invalid upcoming trips search condition', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.fillField(page, 'Order number/train number/name', h.FIXTURES.orderKeyword);
  await h.clickNamed(page, 'Search');
  await h.expectTextsVisible(page, [h.FIXTURES.orderKeyword]);
});
