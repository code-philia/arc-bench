import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.7
// fixtures: products.detail

test('REQ-4.7: Add to Wishlist', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await h.clickFirstAvailable(page, [[/wishlist/i]]);
  await h.expectTextsVisible(page, [/wishlist/i, /sign in|login|added/i]);
});
