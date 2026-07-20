import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-6.1: Start Checkout', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/personal information/i, /checkout/i]);
});
