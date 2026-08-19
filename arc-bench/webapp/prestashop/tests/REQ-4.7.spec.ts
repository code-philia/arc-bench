import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.7
// fixtures: product_detail_product, registered_user, wishlist_state

test('REQ-4.7: Add to Wishlist', async ({ page }) => {
  await h.openDefaultProductDetail(page);
  await h.clickFirstAvailable(page, [[/wishlist/i]]);
  await h.expectTextsVisible(page, [/wishlist/i, /sign in|login|added/i]);
});
