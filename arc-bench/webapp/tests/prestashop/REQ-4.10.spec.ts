import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.10
// fixtures: product_detail_product

test('REQ-4.10: Recently Viewed', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.expectTextsVisible(page, [/recently viewed/i, /product/i]);
});
