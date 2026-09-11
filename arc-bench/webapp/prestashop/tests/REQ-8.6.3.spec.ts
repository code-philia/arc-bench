import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.3
// fixtures: accounts.wishlistView, wishlist.favorites, products.wishlist

test('REQ-8.6.3: View Wishlist Products', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistView);
  await h.clickFirstAvailable(page, [[h.FIXTURES.wishlist.name]]);
  await h.expectTextsVisible(page, [h.FIXTURES.products.wishlist.name, /add to cart/i]);
});
