import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.3
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-6.3.3: Set Invoice Address', async ({ page }) => {
  await h.login(page);
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /addresses/i]]);
  await h.setCheckbox(page, [/use same address/i, /invoice address/i], false);
  await h.expectTextsVisible(page, [/invoice/i, /address/i]);
});
