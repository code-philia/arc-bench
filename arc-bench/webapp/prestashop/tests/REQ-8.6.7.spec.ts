import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.7
// fixtures: registered_user, wishlist_state

test('REQ-8.6.7: Add Wishlist Product to Cart', async ({ page }) => {
  await h.openWishlists(page);
  await h.clickFirstAvailable(page, [[h.FIXTURES.wishlist.name]]);
  await h.clickFirstAvailable(page, [[/add to cart/i]]);
  await h.expectTextsVisible(page, [/cart/i, /added/i]);
});
