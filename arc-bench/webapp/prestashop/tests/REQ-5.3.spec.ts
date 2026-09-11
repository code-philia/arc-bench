import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3
// fixtures: products.cart

test('REQ-5.3: Modify Product Quantity', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/\+/i, /increase/i]]);
  await h.expectTextsVisible(page, [/total/i, /subtotal/i]);
});
