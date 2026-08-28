import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.5
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.5: Submit a valid booking request', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.selectPassengerForBooking(page);
  await h.clickNamed(page, 'Place order');
  await h.expectSuccessFeedback(page);
  await expect(page).toHaveURL(/\/booking\/confirm\?order=/);
  await h.expectDialog(page, 'Please confirm the following information.');
});
