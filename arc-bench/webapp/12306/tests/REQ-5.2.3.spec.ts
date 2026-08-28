import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.3
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.3: Add selected passengers to the booking table', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.selectPassengerForBooking(page);
  await h.expectTextsVisible(page, ['Place order']);
  await expect(page.locator('.booking-table tbody tr')).toHaveCount(1);
  await h.expectTextsVisible(page, ['Ticket class', 'Ticket type', 'Name', 'ID type', 'ID number', 'Nationality', 'Operation', 'Delete']);
});
