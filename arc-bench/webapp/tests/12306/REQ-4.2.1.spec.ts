import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.1
// fixtures: orders_unpaid_user

test('REQ-4.2.1: Open the ticket orders page from the order center menu', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidUser);
  await h.expectTextsVisible(page, ['Uncompleted orders', 'Upcoming trips', 'History orders']);
});
