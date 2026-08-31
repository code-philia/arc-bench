import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.10
// fixtures: orders_upcoming_user

test('REQ-4.2.10: Display upcoming trips in a table', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.expectTextsVisible(page, ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation']);
  expect((await h.visibleDataRowTexts(page)).length).toBeGreaterThan(0);
  await h.expectTextsVisible(page, ['Refund']);
});
