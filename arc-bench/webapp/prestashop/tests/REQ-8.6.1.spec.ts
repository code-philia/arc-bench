import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.1
// fixtures: registered_user, wishlist_state

test('REQ-8.6.1: View Wishlist List', async ({ page }) => {
  await h.openWishlists(page);
  await h.expectTextsVisible(page, [/wishlist/i, h.FIXTURES.wishlist.name]);
});
