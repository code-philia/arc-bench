import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.7
// fixtures: accounts.login

test('REQ-8.7: User Logout', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.login);
  await page.getByRole('button', { name: /^Sign out$/i }).click();
  await expect(page.getByRole('link', { name: /^Sign in$/i })).toBeVisible();
});
