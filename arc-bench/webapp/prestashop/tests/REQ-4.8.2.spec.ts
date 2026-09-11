import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.8.2
// fixtures: products.detail

test('REQ-4.8.2: View Product Details Tab', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.clickFirstAvailable(page, [[/product details/i, /details/i]]);
  await h.expectTextsVisible(page, [/reference/i, /data sheet/i, /features/i]);
});
