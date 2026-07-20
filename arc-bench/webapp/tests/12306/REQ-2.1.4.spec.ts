import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.4
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.4: Submit the form with missing required information', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.clickNamed(page, 'Register');
  await h.expectErrorFeedback(page, 'Please fill in all required fields.');
});
