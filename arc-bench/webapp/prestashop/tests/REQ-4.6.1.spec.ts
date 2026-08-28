import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.1
// fixtures: products.cart

test('REQ-4.6.1: Add Product to Cart', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.expectTextsVisible(page, [/product successfully added to your shopping cart/i, /cart/i]);
});
