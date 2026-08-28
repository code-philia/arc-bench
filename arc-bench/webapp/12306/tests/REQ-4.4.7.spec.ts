import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.7
// fixtures: passenger_manager_user

test('REQ-4.4.7: Submit the add passenger form with an invalid mobile number', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.fillPassengerForm(page, { mobile: '123' });
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Invalid mobile number format.');
});
