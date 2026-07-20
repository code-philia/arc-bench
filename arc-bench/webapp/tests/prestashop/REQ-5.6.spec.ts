import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6
// fixtures: public_homepage

test('REQ-5.6: Continue Shopping Link', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.addProductToCart(page);
  await h.clickFirstAvailable(page, [[/proceed to checkout/i]]);
  await h.clickFirstAvailable(page, [[/continue shopping/i]]);
  await h.expectTextsVisible(page, [/home|products|search/i]);
});
