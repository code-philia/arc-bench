import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.14
// fixtures: orders_empty_user

test('REQ-4.2.14: Open the default ticket search from the empty history orders state', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersEmptyUser);
  await h.clickNamed(page, 'History orders');
  await h.clickNamed(page, 'You can make travel plans through the ticket reservation function.');
  await h.expectQuickSearch(page);
});
