import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.8
// fixtures: orders_upcoming_user

test('REQ-4.2.8: Filter upcoming trips by a selected date type and range', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.expectTextsVisible(page, ['Search by booking date', 'Search by departure date', 'Search']);
});
