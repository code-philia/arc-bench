import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.2
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.2: Display the registration form layout', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.expectRegistrationForm(page);
});
