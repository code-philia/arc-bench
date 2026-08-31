import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.2
// fixtures: booking_payment_user, bookable_route

test('REQ-5.3.2: Open the payment page after confirming the order', async ({ page }) => {
  await h.reachPaymentPage(page, h.FIXTURES.bookingPaymentUser);
  await h.expectTextsVisible(page, ['Seats are locked, Time remained to complete your payment:', 'Order details']);
});
