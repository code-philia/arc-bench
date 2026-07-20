import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1.2
// fixtures: searchable_routes

test('REQ-5.1.2: Open the forgot password page from the quick login form', async ({ page }) => {
  await h.openBookingForm(page, false);
  await h.clickNamed(page, /Forgot password\?/i);
  await h.expectForgotPasswordPage(page);
});
