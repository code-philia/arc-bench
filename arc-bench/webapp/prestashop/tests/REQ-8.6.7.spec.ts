import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.7
// fixtures: accounts.wishlistCart, wishlist.favorites, products.wishlist

test('REQ-8.6.7: Add Wishlist Product to Cart', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistCart);
  await h.clickFirstAvailable(page, [[h.FIXTURES.wishlist.name]]);
  await h.clickFirstAvailable(page, [[/add to cart/i]]);
  await h.expectTextsVisible(page, [/cart/i, /added/i]);
});
