import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.8.1
// fixtures: products.detail

test('REQ-4.8.1: View Description Tab', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.clickFirstAvailable(page, [[/description/i]]);
  await h.expectTextsVisible(page, [/description/i, /hummingbird|regular fit|product/i]);
});
