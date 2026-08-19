import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-5.1: Enter Cart', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/shopping cart/i]);
});
