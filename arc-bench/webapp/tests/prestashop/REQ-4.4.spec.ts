import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4
// fixtures: product_detail_product

test('REQ-4.4: Variant Selection', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.chooseOption(page, [/size/i], h.FIXTURES.product.size);
  await h.clickFirstAvailable(page, [[/white/i]]);
  await h.expectTextsVisible(page, [/white/i, /m/i]);
});
