import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1
// fixtures: product_detail_product

test('REQ-4.5.1: Increase Quantity', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.clickFirstAvailable(page, [[/\+/i, /increase/i]]);
  await h.expectFieldValue(page, [/quantity/i], '2');
});
