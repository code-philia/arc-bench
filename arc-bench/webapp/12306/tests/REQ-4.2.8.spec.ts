import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.8
// fixtures: orders_upcoming_user

test('REQ-4.2.8: Filter upcoming trips by a selected date type and range', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.selectOption(page, 'Order date type', 'Search by departure date');
  await h.fillField(page, 'Start date', h.FIXTURES.searchRoute.date);
  await h.fillField(page, 'End date', h.dateOffset(31));
  await h.clickNamed(page, 'Search');
  await expect(page.locator('.orders-table tbody tr')).toHaveCount(1);
});
