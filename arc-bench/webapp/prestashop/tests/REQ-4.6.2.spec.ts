import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.6.2
// fixtures: products.cart

test('REQ-4.6.2: Continue Shopping After Add', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/continue shopping/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.products.cart.name, /add to cart/i]);
});
