import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.5
// fixtures: accounts.checkoutPayment, products.checkout65, address.home

test('REQ-6.5: Payment Step', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutPayment);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout65);
  for (let step = 0; step < 3; step += 1) {
    await page.getByRole('button', { name: /^Continue$/i }).click();
  }
  await expect(page.getByRole('heading', { name: /^Payment$/i })).toBeVisible();
  await page.getByRole('radio', { name: /^Bank wire$/i }).check();
  await page.getByRole('checkbox', { name: /^I agree to the terms and conditions$/i }).check();
  await expect(page.getByRole('checkbox', { name: /^I agree to the terms and conditions$/i })).toBeChecked();
  await page.getByRole('link', { name: /^View terms and conditions$/i }).click();
  await expect(page.getByRole('heading', { name: /^Terms and conditions$/i }).first()).toBeVisible();
});
