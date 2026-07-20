import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.1
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-6.3.1: Select Existing Address', async ({ page }) => {
  await h.login(page);
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /addresses/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.address.alias, /selected|address/i]);
});
