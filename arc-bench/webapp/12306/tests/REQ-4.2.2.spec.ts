import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.2
// fixtures: orders_empty_user

test('REQ-4.2.2: Display the empty state in uncompleted orders', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersEmptyUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.expectTextsVisible(page, ['Search tickets']);
});
