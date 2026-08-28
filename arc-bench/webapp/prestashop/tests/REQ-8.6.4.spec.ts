import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.4
// fixtures: accounts.wishlistRename, wishlist.favorites

test('REQ-8.6.4: Rename Wishlist', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistRename);
  await h.clickFirstAvailable(page, [[/edit/i, /rename/i]]);
  await h.fillField(page, [/name/i], h.FIXTURES.wishlist.renamed);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.wishlist.renamed]);
});
