import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.3
// fixtures: reset_user

test('REQ-2.4.3: Complete a valid password reset', async ({ page }) => {
  await h.openForgotPasswordPage(page);
  await h.fillForgotPasswordStepOne(page, h.FIXTURES.resetUser.email, h.FIXTURES.resetUser.idNumber);
  await h.clickNamed(page, 'submit');
  await h.fillForgotPasswordStepTwo(page, h.FIXTURES.resetUser.newPassword, h.FIXTURES.resetUser.newPassword);
  await h.clickNamed(page, 'submit');
  await h.expectSuccessFeedback(page);
  await h.openLoginPage(page);
  await h.fillLoginForm(page, h.FIXTURES.resetUser.email, h.FIXTURES.resetUser.newPassword);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
});
