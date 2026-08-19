import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-5.4: Delete Product', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/delete/i, /remove/i]]);
  await h.expectTextsVisible(page, [/cart/i, /empty|subtotal/i]);
});
