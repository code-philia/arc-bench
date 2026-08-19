import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.4
// fixtures: product_detail_product

test('REQ-4.5.4: Stock Insufficient Warning', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.setProductQuantity(page, h.FIXTURES.product.excessiveQuantity);
  await h.addProductToCart(page);
  await h.expectTextsVisible(page, [/stock/i, /insufficient/i, /available/i]);
});
