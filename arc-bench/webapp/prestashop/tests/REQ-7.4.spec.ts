import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.4
// fixtures: accounts.login

test('REQ-7.4: Forgot Password', async ({ page }) => {
  await h.openSignIn(page);
  await page.getByRole('link', { name: /^Forgot your password\?$/i }).click();
  await expect(page.getByRole('heading', { name: /^Reset your password$/i })).toBeVisible();
  await page.getByRole('textbox', { name: /^Email address$/i }).fill(h.FIXTURES.accounts.login.email);
  await page.getByRole('button', { name: /^Send reset link$/i }).click();
  await expect(page.getByText(/^A password reset link has been sent to your email address\.$/i)).toBeVisible();
});
