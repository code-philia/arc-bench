import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.5
// fixtures: orders_unpaid_user

test('REQ-4.2.5: Continue payment from the uncompleted orders tab', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.clickNamed(page, /Pay/i);
  await h.expectTextsVisible(page, ['Order details']);
});
