import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.7
// fixtures: accounts.checkoutOrderComplete, products.orderComplete, address.home

test('REQ-6.7: Order Complete Page', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutOrderComplete);
  await h.openProductDetail(page, h.FIXTURES.products.orderComplete);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /shipping/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /payment/i]]);
  await h.clickFirstAvailable(page, [[/bank wire/i, /pay by check/i]]);
  await h.setCheckbox(page, [/terms/i], true);
  await h.clickFirstAvailable(page, [[/place order/i, /confirm order/i]]);
  await h.expectTextsVisible(page, [/reference/i, /order details/i]);
  await h.clickFirstAvailable(page, [[/continue shopping/i]]);
  await h.expectHome(page);
});
