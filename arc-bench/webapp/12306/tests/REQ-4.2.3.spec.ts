import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.3
// fixtures: orders_empty_user

test('REQ-4.2.3: Open the default ticket search from the empty uncompleted orders state', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersEmptyUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.clickNamed(page, 'You can book your tickets and plan your trips.');
  await h.expectQuickSearch(page);
});
