import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.11
// fixtures: orders_upcoming_user

test('REQ-4.2.11: Refund one eligible upcoming trip', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.clickNamed(page, /Refund/i);
  await h.expectSuccessFeedback(page);
});
