import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.3
// fixtures: products.cart

test('REQ-4.6.3: Proceed to Checkout After Add', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/shopping cart/i, /subtotal/i]);
});
