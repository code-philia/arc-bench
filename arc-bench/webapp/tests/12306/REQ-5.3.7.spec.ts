import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.7
// fixtures: orders_cancelled_user

test('REQ-5.3.7: Show a cancelled order in the uncompleted orders tab', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersCancelledUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.expectTextsVisible(page, ['Uncompleted orders']);
});
