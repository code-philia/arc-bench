import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: products.cart

test('REQ-5.1: Enter Cart', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/shopping cart/i]);
});
