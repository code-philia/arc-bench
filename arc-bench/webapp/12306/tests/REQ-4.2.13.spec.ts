import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.13
// fixtures: orders_empty_user

test('REQ-4.2.13: Display the empty state in history orders', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersEmptyUser);
  await h.clickNamed(page, 'History orders');
  await h.expectTextsVisible(page, ['Search tickets', "You don't have any bookings or we can't access your bookings at this time."]);
});
