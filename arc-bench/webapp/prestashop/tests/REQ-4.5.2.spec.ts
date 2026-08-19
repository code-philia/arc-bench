import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: product_detail_product

test('REQ-4.5.2: Decrease Quantity', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.clickFirstAvailable(page, [[/\-/i, /decrease/i]]);
  await h.expectFieldValue(page, [/quantity/i], '1');
});
