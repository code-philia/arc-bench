import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.1
// fixtures: booking_confirm_user, booking_edit_user, bookable_route

test('REQ-5.3.1: Confirm the order information and continue', async ({ page }) => {
  await h.openBookingForm(page, true, h.FIXTURES.bookingConfirmUser);
  await h.selectPassengerForBooking(page);
  await h.clickNamed(page, 'Place order');
  await h.expectDialog(page, 'Please confirm the following information.');
  await h.expectTextsVisible(page, ['Passenger', 'Seats', 'Total']);
  await h.clickDialogAction(page, 'Please confirm the following information.', 'Confirm');
  await h.expectTextsVisible(page, ['Order submitted successfully.']);
});

test('REQ-5.3.1: Return to edit from the confirmation dialog', async ({ page }) => {
  await h.openBookingForm(page, true, h.FIXTURES.bookingEditUser);
  await h.selectPassengerForBooking(page);
  await h.clickNamed(page, 'Place order');
  await h.clickDialogAction(page, 'Please confirm the following information.', 'Edit');
  await h.expectTextsVisible(page, ['Place order']);
});
