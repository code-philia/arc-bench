import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.8.1
// fixtures: product_detail_product

test('REQ-4.8.1: View Description Tab', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.clickFirstAvailable(page, [[/description/i]]);
  await h.expectTextsVisible(page, [/description/i, /hummingbird|regular fit|product/i]);
});
