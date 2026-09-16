import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.3
// fixtures: accounts.checkoutInvoiceAddress, products.checkout633, address.home

test('REQ-6.3.3: Set Invoice Address', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutInvoiceAddress);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout633);
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await page.getByRole('checkbox', { name: /^Use this address for invoice$/i }).uncheck();
  await expect(page.getByRole('heading', { name: /^Invoice address$/i })).toBeVisible();
});
