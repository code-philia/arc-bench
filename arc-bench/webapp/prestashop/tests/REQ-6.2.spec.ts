import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: product_detail_product, cart_ready_product, checkout_customer

test('REQ-6.2: Personal Information Step', async ({ page }) => {
  await h.login(page);
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/personal information/i, /address/i, /sign in|guest|create account/i]);
});
