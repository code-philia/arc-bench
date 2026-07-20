import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2
// fixtures: product_detail_product

test('REQ-4.2: Product Image Area', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.expectTextsVisible(page, [/image/i, /zoom/i]);
});
