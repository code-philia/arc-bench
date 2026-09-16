import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.2
// fixtures: accounts.checkoutNewAddress, products.checkout632

test('REQ-6.3.2: Add New Address', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutNewAddress);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout632);
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await page.getByRole('button', { name: /^Add new address$/i }).click();
  for (const field of ['Alias *', 'Address *', 'City *', 'Country *']) {
    await expect(page.getByRole('main').getByLabel(field, { exact: true }).first()).toBeVisible();
  }
});
