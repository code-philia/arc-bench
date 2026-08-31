import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.7
// fixtures: booking_cancelled_user, bookable_route

test('REQ-5.3.7: Show a cancelled order in the uncompleted orders tab', async ({ page }) => {
  await h.reachPaymentPage(page, h.FIXTURES.bookingCancelledUser);
  await h.clickNamed(page, 'Cancel');
  await h.expectTextsVisible(page, ['Uncompleted orders', 'Cancelled']);
});
