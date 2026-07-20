import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.3
// fixtures: product_detail_product

test('REQ-4.5.3: Direct Input Quantity', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.setProductQuantity(page, h.FIXTURES.product.quantity);
  await h.expectFieldValue(page, [/quantity/i], h.FIXTURES.product.quantity);
});
