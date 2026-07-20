import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.6
// fixtures: password_reset_user

test('REQ-2.4.6: Submit the new password step with mismatched passwords', async ({ page }) => {
  await h.openForgotPasswordPage(page);
  await h.fillForgotPasswordStepOne(page, h.FIXTURES.resetUser.email, h.FIXTURES.resetUser.idNumber);
  await h.clickNamed(page, 'submit');
  await h.fillForgotPasswordStepTwo(page, 'Password123!X', 'Password123!Y');
  await h.clickNamed(page, 'submit');
  await h.expectErrorFeedback(page, 'Passwords do not match.');
});
