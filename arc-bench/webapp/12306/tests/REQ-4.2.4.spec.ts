import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.4
// fixtures: orders_unpaid_user

test('REQ-4.2.4: Display uncompleted orders in a table', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUnpaidUser);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.expectTextsVisible(page, ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation']);
  expect((await h.visibleDataRowTexts(page)).length).toBeGreaterThan(0);
  await h.expectTextsVisible(page, ['Pay']);
});
