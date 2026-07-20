import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.7
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.7: Submit the form with mismatched passwords', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'mismatch');
  await h.clickNamed(page, 'Register');
  await h.expectErrorFeedback(page, 'Passwords do not match.');
});
