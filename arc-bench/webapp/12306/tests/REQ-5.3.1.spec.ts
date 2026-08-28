import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.1
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.3.1: Confirm the order information and continue', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.selectPassengerForBooking(page);
  await h.clickNamed(page, 'Place order');
  await h.expectDialog(page, 'Please confirm the following information.');
  await h.expectTextsVisible(page, ['Passenger', 'Seats', 'Total']);
  await h.clickNamed(page, 'Confirm');
  await h.expectTextsVisible(page, ['Order submitted successfully.']);
});

test('REQ-5.3.1: Return to edit from the confirmation dialog', async ({ page }) => {
  await h.resetTestDatabase(page);
  await h.openBookingForm(page, true);
  await h.selectPassengerForBooking(page);
  await h.clickNamed(page, 'Place order');
  await h.clickNamed(page, 'Edit');
  await h.expectTextsVisible(page, ['Place order']);
});
