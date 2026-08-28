import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.6
// fixtures: passenger_manager_user

test('REQ-4.4.6: Submit the add passenger form with an invalid email address', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.fillPassengerForm(page, { email: 'invalid-email' });
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Invalid email address format.');
});
