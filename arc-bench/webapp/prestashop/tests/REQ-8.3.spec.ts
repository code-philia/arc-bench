import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.3
// fixtures: accounts.profile

test('REQ-8.3: Account Information Management', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.profile);
  await page.getByRole('link', { name: /^Information$/i }).first().click();
  await page.getByLabel('Email address *', { exact: true }).fill('prestashop_profile_user_next@example.com');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByText(/^Your information has been updated successfully\.$/i)).toBeVisible();
  await page.getByLabel('New password', { exact: true }).fill('ShopPass456!');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByText(/^Your information has been updated successfully\.$/i)).toBeVisible();
  await page.getByRole('button', { name: /^Sign out$/i }).click();
  await page.getByRole('link', { name: /^Sign in$/i }).click();
  await page.getByLabel('Email address *', { exact: true }).fill('prestashop_profile_user_next@example.com');
  await page.getByLabel('Password *', { exact: true }).fill('ShopPass456!');
  await page.getByRole('button', { name: /^SIGN IN$/i }).click();
  await expect(page.getByRole('heading', { name: /^My account$/i }).first()).toBeVisible();
});
