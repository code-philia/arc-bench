import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.3
// fixtures: registration_candidate

test('REQ-7.3: User Registration', async ({ page }) => {
  await h.openSignIn(page);
  await page.getByRole('link', { name: /^No account\? Create one here$/i }).click();
  await page.getByRole('radio', { name: /^Mr$/i }).check();
  await page.getByLabel('First name *', { exact: true }).fill('New');
  await page.getByLabel('Last name *', { exact: true }).fill('Customer');
  await page.getByLabel('Email address *', { exact: true }).fill(`new_customer_${Date.now()}@example.com`);
  await page.getByLabel('Password *', { exact: true }).fill('ShopPass123!');
  await page.getByLabel('Birthdate', { exact: true }).fill('1995-08-21');
  await page.getByRole('checkbox', { name: /^Receive offers from PrestaShop partners$/i }).check();
  await page.getByRole('checkbox', { name: /^Subscribe to our newsletter$/i }).check();
  await page.getByRole('checkbox', { name: /^I agree to the terms and conditions \*$/i }).check();
  await page.getByRole('button', { name: /^SAVE$/i }).click();
  await expect(page.getByRole('heading', { name: /^My account$/i }).first()).toBeVisible();
});
