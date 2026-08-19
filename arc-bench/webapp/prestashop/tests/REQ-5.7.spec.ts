import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.7
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-5.7: Proceed to Checkout Button', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/checkout|personal information/i]);
});
