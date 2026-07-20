import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.7
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-6.7: Order Complete Page', async ({ page }) => {
  await h.login(page);
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /shipping/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /payment/i]]);
  await h.clickFirstAvailable(page, [[/bank wire/i, /pay by check/i]]);
  await h.setCheckbox(page, [/terms/i], true);
  await h.clickFirstAvailable(page, [[/place order/i, /confirm order/i]]);
  await h.expectTextsVisible(page, [/reference/i, /order details/i]);
  await h.clickFirstAvailable(page, [[/continue shopping/i]]);
  await h.expectHome(page);
});
