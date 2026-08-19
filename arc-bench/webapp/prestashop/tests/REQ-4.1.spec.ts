import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: product_detail_product

test('REQ-4.1: Enter Product Detail Page', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.expectTextsVisible(page, [h.FIXTURES.product.name, /add to cart/i]);
});
