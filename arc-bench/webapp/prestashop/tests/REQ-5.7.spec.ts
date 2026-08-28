import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.7
// fixtures: products.cart

test('REQ-5.7: Proceed to Checkout Button', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/checkout|personal information/i]);
});
