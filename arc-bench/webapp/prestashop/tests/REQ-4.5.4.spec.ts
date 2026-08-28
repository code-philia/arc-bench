import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.4
// fixtures: products.detail

test('REQ-4.5.4: Stock Insufficient Warning', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.setProductQuantity(page, h.FIXTURES.products.detail.excessiveQuantity!);
  await h.addProductToCart(page);
  await h.expectTextsVisible(page, [/stock/i, /insufficient/i, /available/i]);
});
