import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.9
// fixtures: orders_unpaid_user, orders_unpaid_dismiss_user

test('REQ-5.3.9: Confirm cancellation of an unpaid order from the order center', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.clickNamed(page, 'Cancel');
  await h.clickDialogAction(page, 'Are you sure you want to cancel this order?', 'Confirm');
  await h.expectSuccessFeedback(page);
});

test('REQ-5.3.9: Cancel the cancellation action from the order center dialog', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidDismissUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.clickNamed(page, 'Cancel');
  await h.clickDialogAction(page, 'Are you sure you want to cancel this order?', 'Cancel');
  await h.expectTextsVisible(page, ['Uncompleted orders']);
});
