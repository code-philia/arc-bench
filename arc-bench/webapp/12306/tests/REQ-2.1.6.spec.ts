import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.6
// fixtures: public_homepage, existing_username_user

test('REQ-2.1.6: Submit the form with an existing username', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'duplicateUsername');
  await h.clickNamed(page, 'Register');
  await h.expectErrorFeedback(page, 'Username already exists.');
});
