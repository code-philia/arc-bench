import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.9
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.9: Submit the form without accepting the agreement', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'noAgreement');
  await h.clickNamed(page, 'Register');
  await h.expectErrorFeedback(page, 'Please agree to the Terms of Service and Privacy Policy.');
});
