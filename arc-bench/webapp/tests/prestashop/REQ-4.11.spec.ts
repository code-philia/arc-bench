import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.11
// fixtures: product_detail_product

test('REQ-4.11: Related Products', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.expectTextsVisible(page, [/related products/i, /you might also like/i, /same category/i]);
});
