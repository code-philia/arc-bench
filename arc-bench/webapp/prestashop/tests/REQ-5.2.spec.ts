import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2
// fixtures: products.cart

test('REQ-5.2: Cart Product List', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.products.cart.name, /quantity/i, /subtotal/i, /delete/i]);
});
