import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.1
// fixtures: password_reset_user

test('REQ-2.4.1: Open the forgot password page from the login page', async ({ page }) => {
  await h.openForgotPasswordPage(page);
  await h.expectForgotPasswordPage(page);
});
