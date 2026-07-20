import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.3
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-4.6.3: Proceed to Checkout After Add', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/shopping cart/i, /subtotal/i]);
});
