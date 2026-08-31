import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.4
// fixtures: booking_paid_user, bookable_route

test('REQ-5.3.4: Complete payment from the payment page', async ({ page }) => {
  await h.reachPaymentPage(page, h.FIXTURES.bookingPaidUser);
  await h.clickNamed(page, 'Pay');
  await h.expectSuccessFeedback(page);
  await h.expectTextsVisible(page, ['Upcoming trips', 'Refund']);
});
