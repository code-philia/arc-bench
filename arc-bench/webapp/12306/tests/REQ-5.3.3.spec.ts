import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.3
// fixtures: booking_cancel_user, bookable_route

test('REQ-5.3.3: Cancel the order from the payment page', async ({ page }) => {
  await h.reachPaymentPage(page, h.FIXTURES.bookingCancelUser);
  await h.clickNamed(page, 'Cancel');
  await h.expectSuccessFeedback(page);
  await h.expectTextsVisible(page, ['Uncompleted orders', 'Cancelled']);
});
