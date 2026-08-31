import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1.3
// fixtures: public_homepage, registration_candidates

test('REQ-2.1.3: Submit a valid registration form', async ({ page }) => {
  const registration = h.makeUniqueRegistrationData();

  await h.openRegistrationPage(page);
  await h.fillRegistrationForm(page, 'valid', registration);
  await h.clickNamed(page, 'Register');
  await h.expectSuccessFeedback(page);
  await h.openLoginPage(page);
  await h.expectLoginForm(page);
  await h.fillLoginForm(page, registration.username, registration.password);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('link', { name: /test traveler/i })).toBeVisible();
});
