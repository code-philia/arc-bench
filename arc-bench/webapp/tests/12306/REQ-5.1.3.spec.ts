import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1.3
// fixtures: searchable_routes

test('REQ-5.1.3: Open the registration page from the quick login form', async ({ page }) => {
  await h.openBookingForm(page, false);
  await h.clickNamed(page, /Register/i);
  await h.expectRegistrationForm(page);
});
