import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.8
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.8: Submit the form with an invalid email address', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'invalidEmail');
  await h.clickNamed(page, 'Register');
  await h.expectErrorFeedback(page, 'Invalid email address format.');
});
