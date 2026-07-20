import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3
// fixtures: product_detail_product

test('REQ-4.3: Product Basic Info', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.expectTextsVisible(page, [h.FIXTURES.product.name, /€|\$/i, /tax/i, /20%/i, /description/i]);
});
