import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.5
// fixtures: passenger_manager_user

test('REQ-4.4.5: Submit the add passenger form with an existing passport number', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.fillPassengerForm(page, { passportNumber: h.FIXTURES.registeredUser.passportNumber });
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Passport number already exists.');
});
