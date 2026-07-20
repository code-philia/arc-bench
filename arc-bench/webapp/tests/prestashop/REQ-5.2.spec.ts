import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-5.2: Cart Product List', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.product.name, /quantity/i, /subtotal/i, /delete/i]);
});
