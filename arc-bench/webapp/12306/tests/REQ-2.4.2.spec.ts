import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.2
// fixtures: password_reset_user

test('REQ-2.4.2: Display the forgot password forms', async ({ page }) => {
  await h.openForgotPasswordPage(page);
  await h.expectTextsVisible(page, ['Email', 'ID number', 'submit']);
});
