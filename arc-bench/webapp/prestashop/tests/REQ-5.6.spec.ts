import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6
// fixtures: products.cart

test('REQ-5.6: Continue Shopping Link', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue shopping/i]]);
  await h.expectTextsVisible(page, [/home|products|search/i]);
});
