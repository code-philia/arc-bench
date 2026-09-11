import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: accounts.checkoutInformation, products.checkoutStep

test('REQ-6.2: Personal Information Step', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutInformation);
  await h.openProductDetail(page, h.FIXTURES.products.checkoutStep);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.expectTextsVisible(page, [/personal information/i, /address/i, /sign in|guest|create account/i]);
});
