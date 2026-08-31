import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.5
// fixtures: booking_unpaid_user, bookable_route

test('REQ-5.3.5: Show an unpaid order in the uncompleted orders tab', async ({ page }) => {
  await h.reachPaymentPage(page, h.FIXTURES.bookingUnpaidUser);
  await h.openTicketOrdersFromCurrentPage(page);
  await h.clickNamed(page, 'Uncompleted orders');
  await h.expectTextsVisible(page, ['Uncompleted orders', 'Pay']);
});
