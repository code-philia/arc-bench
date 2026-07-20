import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.1
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-4.6.1: Add Product to Cart', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.expectTextsVisible(page, [/product successfully added to your shopping cart/i, /cart/i]);
});
