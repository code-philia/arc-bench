import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.4
// fixtures: bookable_user, bookable_route, passenger_manager_user

test('REQ-5.2.4: Open the terms of service page from the booking form', async ({ page }) => {
  await h.openBookingForm(page, true);
  await h.clickNamed(page, 'Terms of Service');
  await h.expectTextsVisible(page, ['Terms of Service']);
});
