import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: products.detail

test('REQ-4.5.2: Decrease Quantity', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.clickFirstAvailable(page, [[/\-/i, /decrease/i]]);
  await h.expectFieldValue(page, [/quantity/i], '1');
});
