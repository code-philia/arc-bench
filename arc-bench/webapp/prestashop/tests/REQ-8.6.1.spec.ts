import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.1
// fixtures: accounts.wishlistView, wishlist.favorites

test('REQ-8.6.1: View Wishlist List', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistView);
  await expect(page.getByRole('heading', { name: /^Wishlist$/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Favorites$/i })).toBeVisible();
});
