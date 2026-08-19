import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-5.3: Modify Product Quantity', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/\+/i, /increase/i]]);
  await h.expectTextsVisible(page, [/total/i, /subtotal/i]);
});
