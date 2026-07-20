import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.4
// fixtures: passenger_manager_user

test('REQ-4.4.4: Submit the add passenger form with missing required information', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.clickNamed(page, 'Determine');
  await h.expectErrorFeedback(page, 'Please fill in all required fields.');
});
