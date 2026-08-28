import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.4
// fixtures: reset_user

test('REQ-2.4.4: Submit the identity verification step with missing information', async ({ page }) => {
  await h.openForgotPasswordPage(page);
  await h.clickNamed(page, 'submit');
  await h.expectErrorFeedback(page, 'Please enter your email and ID number.');
});
