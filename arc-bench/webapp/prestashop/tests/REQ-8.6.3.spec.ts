import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.3
// fixtures: registered_user, wishlist_state

test('REQ-8.6.3: View Wishlist Products', async ({ page }) => {
  await h.openWishlists(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.wishlist.name]]);
  await h.expectTextsVisible(page, [h.FIXTURES.product.name, /add to cart/i]);
});
