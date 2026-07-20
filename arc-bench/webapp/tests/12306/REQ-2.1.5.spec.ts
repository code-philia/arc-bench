import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.5
// fixtures: public_homepage, existing_passport_user

test('REQ-2.1.5: Submit the form with an existing passport number', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'duplicatePassport');
  await h.clickNamed(page, 'Register');
  await h.expectErrorFeedback(page, 'Passport number already exists.');
});
