import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.5
// fixtures: orders_unpaid_user

test('REQ-5.3.5: Show an unpaid order in the uncompleted orders tab', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.expectTextsVisible(page, ['Uncompleted orders']);
});
