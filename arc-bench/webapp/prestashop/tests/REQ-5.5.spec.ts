import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-5.5: Cart Summary', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/subtotal/i, /shipping/i, /discount/i, /tax incl/i, /total/i]);
});
