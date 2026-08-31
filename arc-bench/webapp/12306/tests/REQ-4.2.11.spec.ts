import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.11
// fixtures: orders_refund_user

test('REQ-4.2.11: Refund one eligible upcoming trip', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersRefundUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.clickNamed(page, /Refund/i);
  await h.expectTextsVisible(page, ['Refund information', 'Refund amount', 'Confirm refund']);
  await h.clickNamed(page, 'Confirm refund');
  await h.expectSuccessFeedback(page);
  await h.clickNamed(page, 'View History orders');
  await h.expectTextsVisible(page, ['History orders', 'Train Information']);
});
