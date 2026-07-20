import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.2
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-4.6.2: Continue Shopping After Add', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/continue shopping/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.product.name, /add to cart/i]);
});
