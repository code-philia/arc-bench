import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.8.2
// fixtures: product_detail_product

test('REQ-4.8.2: View Product Details Tab', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.clickFirstAvailable(page, [[/product details/i, /details/i]]);
  await h.expectTextsVisible(page, [/reference/i, /data sheet/i, /features/i]);
});
