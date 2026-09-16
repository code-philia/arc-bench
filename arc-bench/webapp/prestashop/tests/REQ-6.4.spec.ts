import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.4
// fixtures: accounts.checkoutShipping, products.checkout64, address.home

test('REQ-6.4: Shipping Method Step', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutShipping);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout64);
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await expect(page.getByRole('heading', { name: /^Shipping method$/i })).toBeVisible();
  const total = page.getByLabel('Order total', { exact: true });
  const standardTotal = await total.textContent();
  await page.getByRole('radio', { name: /^Express delivery$/i }).check();
  await expect(total).not.toHaveText(standardTotal || '');
});
