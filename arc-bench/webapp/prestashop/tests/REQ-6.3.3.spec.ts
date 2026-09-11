import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.3
// fixtures: accounts.checkoutInvoice, products.checkoutStep, address.home

test('REQ-6.3.3: Set Invoice Address', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutInvoice);
  await h.openProductDetail(page, h.FIXTURES.products.checkoutStep);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /addresses/i]]);
  await h.setCheckbox(page, [/use same address/i, /invoice address/i], false);
  await h.expectTextsVisible(page, [/invoice/i, /address/i]);
});
