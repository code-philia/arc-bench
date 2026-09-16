import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2
// fixtures: accounts.login

test('REQ-7.2: User Login', async ({ page }) => {
  await h.openSignIn(page);
  await page.getByLabel('Email address *', { exact: true }).fill(h.FIXTURES.accounts.login.email);
  const password = page.getByLabel('Password *', { exact: true });
  await password.fill(h.FIXTURES.accounts.login.password);
  await page.getByRole('button', { name: /^SHOW$/i }).click();
  await expect(page.getByRole('button', { name: /^HIDE$/i })).toBeVisible();
  await page.getByRole('checkbox', { name: /^Remember me$/i }).check();
  await page.getByRole('button', { name: /^SIGN IN$/i }).click();
  await expect(page.getByRole('heading', { name: /^My account$/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Sign out$/i })).toBeVisible();
});
