import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.3
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.3: Submit a valid registration form', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'valid');
  await h.clickNamed(page, 'Register');
  await h.expectSuccessFeedback(page);
  await expect(page).toHaveURL(/\/login/);
  await h.fillLoginForm(page, h.FIXTURES.registration.username, h.FIXTURES.registration.password);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('link', { name: /test traveler|traveler_new/i })).toBeVisible();
});
