import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.6
// fixtures: accounts.checkoutOrderConfirmation, products.orderConfirmation, address.home

test('REQ-6.6: Order Confirmation', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutOrderConfirmation);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.orderConfirmation);
  for (let step = 0; step < 3; step += 1) {
    await page.getByRole('button', { name: /^Continue$/i }).click();
  }
  await page.getByRole('radio', { name: /^Bank wire$/i }).check();
  await page.getByRole('checkbox', { name: /^I agree to the terms and conditions$/i }).check();
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await expect(page.getByRole('heading', { name: /^Order confirmation$/i })).toBeVisible();
  await page.getByRole('button', { name: /^Place order$/i }).click();
  await expect(page.getByRole('heading', { name: /^Order complete$/i })).toBeVisible();
});
