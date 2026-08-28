import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.4
// fixtures: accounts.checkoutInvoice, products.checkoutStep, address.home

test('REQ-6.4: Shipping Method Step', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutInvoice);
  await h.openProductDetail(page, h.FIXTURES.products.checkoutStep);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue/i, /shipping/i]]);
  await h.expectTextsVisible(page, [/shipping method/i, /delivery/i, /€|\$/i]);
  await h.clickFirstAvailable(page, [[/delivery/i, /pick up/i]]);
  await h.expectTextsVisible(page, [/total/i]);
});
