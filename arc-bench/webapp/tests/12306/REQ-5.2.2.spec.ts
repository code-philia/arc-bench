import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.2
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.2: Display the booking information section for the selected train', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.expectTextsVisible(page, ['Train Information', 'Place order']);
});
