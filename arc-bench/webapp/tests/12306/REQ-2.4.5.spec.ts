import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.5
// fixtures: password_reset_user

test('REQ-2.4.5: Submit the identity verification step with unmatched records', async ({ page }) => {
  await h.openForgotPasswordPage(page);
  await h.fillForgotPasswordStepOne(page, 'wrong@example.com', 'P20260011');
  await h.clickNamed(page, 'submit');
  await h.expectErrorFeedback(page, 'Email address and ID number do not match.');
});
