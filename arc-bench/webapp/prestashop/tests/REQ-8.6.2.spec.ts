import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.2
// fixtures: registered_user, wishlist_state

test('REQ-8.6.2: Create New Wishlist', async ({ page }) => {
  await h.openWishlists(page);
  await h.clickFirstAvailable(page, [[/create new wishlist/i, /new wishlist/i]]);
  await h.expectTextsVisible(page, [/wishlist/i, /name/i]);
  await h.fillField(page, [/name/i], h.FIXTURES.wishlist.renamed);
  await h.clickFirstAvailable(page, [[/save/i, /create/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.wishlist.renamed]);
});
