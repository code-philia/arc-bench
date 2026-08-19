import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.9.1
// fixtures: product_detail_product, reviewed_product

test('REQ-4.9.1: View Review List', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.expectTextsVisible(page, [/review/i, /rating/i, /average/i]);
});
