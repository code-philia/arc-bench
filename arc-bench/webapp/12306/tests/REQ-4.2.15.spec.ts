import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.15
// fixtures: orders_history_user

test('REQ-4.2.15: Filter history orders by ride date range', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersHistoryUser);
  await h.clickNamed(page, 'History orders');
  await h.selectOption(page, 'Order date type', 'Search by departure date');
  await h.fillField(page, 'Start date', h.dateOffset(-2));
  await h.fillField(page, 'End date', h.TEST_DATE);
  await h.clickNamed(page, 'Search');
  await expect(page.locator('.orders-table tbody tr')).toHaveCount(1);
});
