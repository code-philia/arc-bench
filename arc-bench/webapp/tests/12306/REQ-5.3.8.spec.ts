import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.8
// fixtures: orders_unpaid_user

test('REQ-5.3.8: Open the payment page from the uncompleted orders tab', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.clickNamed(page, 'Pay');
  await h.expectTextsVisible(page, ['Order details']);
});
