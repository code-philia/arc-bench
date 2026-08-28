import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5
// fixtures: products.cart

test('REQ-5.5: Cart Summary', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.cart);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/subtotal/i, /shipping/i, /discount/i, /tax incl/i, /total/i]);
});
