import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.7
// fixtures: accounts.checkoutOrderComplete, products.orderComplete, address.home

test('REQ-6.7: Order Complete Page', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutOrderComplete);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.orderComplete);
  for (let step = 0; step < 3; step += 1) {
    await page.getByRole('button', { name: /^Continue$/i }).click();
  }
  await page.getByRole('radio', { name: /^Bank wire$/i }).check();
  await page.getByRole('checkbox', { name: /^I agree to the terms and conditions$/i }).check();
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await page.getByRole('button', { name: /^Place order$/i }).click();
  await expect(page.getByText(/Order reference:/i)).toBeVisible();
  await expect(page.getByText(/^Order details$/i)).toBeVisible();
  await page.getByRole('link', { name: /^Continue shopping$/i }).click();
  await expect(page.getByRole('region', { name: /^Carousel$/i })).toBeVisible();
});
