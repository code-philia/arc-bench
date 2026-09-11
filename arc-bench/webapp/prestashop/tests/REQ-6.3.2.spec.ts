import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.2
// fixtures: accounts.checkoutNewAddress, products.checkoutStep

test('REQ-6.3.2: Add New Address', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutNewAddress);
  await h.openProductDetail(page, h.FIXTURES.products.checkoutStep);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /addresses/i]]);
  await h.clickFirstAvailable(page, [[/add new address/i]]);
  await h.expectTextsVisible(page, [/alias/i, /address/i, /city/i, /country/i]);
});
