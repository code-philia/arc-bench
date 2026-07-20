import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2
// fixtures: passenger_manager_user

test('REQ-4.4.2: Open the add passenger form from the passenger list page', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.expectTextsVisible(page, ['Nationality', 'Name', 'Passport number', 'Passport expiration date', 'Date of birth', 'Gender', 'Email address', 'Mobile number', 'Passenger type', 'Cancel', 'Determine']);
});
