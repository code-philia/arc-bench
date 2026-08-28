import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.5
// fixtures: accounts.wishlistDelete, wishlist.favorites

test('REQ-8.6.5: Delete Wishlist', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistDelete);
  await h.clickFirstAvailable(page, [[/delete/i]]);
  await h.expectTextsVisible(page, [/wishlist/i, /deleted|removed|success/i]);
});
