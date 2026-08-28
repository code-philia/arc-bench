import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4
// fixtures: products.cart

test('REQ-5.4: Delete Product', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/delete/i, /remove/i]]);
  await h.expectTextsVisible(page, [/cart/i, /empty|subtotal/i]);
});
