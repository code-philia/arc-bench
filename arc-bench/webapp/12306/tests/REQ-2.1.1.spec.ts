import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.1
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.1: Open the registration page from the home page', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.expectRegistrationForm(page);
});
