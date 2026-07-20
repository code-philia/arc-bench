import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.6
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.6: Submit the booking form without selecting any passenger', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.clickNamed(page, 'Place order');
  await h.expectErrorFeedback(page, 'Please select at least one passenger.');
});
