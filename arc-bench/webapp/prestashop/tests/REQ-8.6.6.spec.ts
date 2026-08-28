import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.6
// fixtures: accounts.wishlistRemove, wishlist.favorites, products.wishlist

test('REQ-8.6.6: Remove Product from Wishlist', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistRemove);
  await h.clickFirstAvailable(page, [[h.FIXTURES.wishlist.name]]);
  await h.clickFirstAvailable(page, [[/remove/i, /delete/i]]);
  await h.expectTextsVisible(page, [/removed|deleted|success/i]);
});
