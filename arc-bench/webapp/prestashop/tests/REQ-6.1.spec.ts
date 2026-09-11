import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: products.checkoutStep

test('REQ-6.1: Start Checkout', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.checkoutStep);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/personal information/i, /checkout/i]);
});
