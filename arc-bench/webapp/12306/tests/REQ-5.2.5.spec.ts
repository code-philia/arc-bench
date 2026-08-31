import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.5
// fixtures: booking_submit_user, bookable_route

test('REQ-5.2.5: Submit a valid booking request', async ({ page }) => {
  await h.openBookingForm(page, true, h.FIXTURES.bookingSubmitUser);
  await h.selectPassengerForBooking(page);
  await h.clickNamed(page, 'Place order');
  await h.expectSuccessFeedback(page);
  await h.expectDialog(page, 'Please confirm the following information.');
});
