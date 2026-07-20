import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.4
// fixtures: registered_user, wishlist_state

test('REQ-8.6.4: Rename Wishlist', async ({ page }) => {
  await h.openWishlists(page);
  await h.clickFirstAvailable(page, [[/edit/i, /rename/i]]);
  await h.fillField(page, [/name/i], h.FIXTURES.wishlist.renamed);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.wishlist.renamed]);
});
