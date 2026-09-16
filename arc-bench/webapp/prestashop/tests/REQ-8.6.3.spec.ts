import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.3
// fixtures: accounts.wishlistView, wishlist.favorites, products.wishlist

test('REQ-8.6.3: View Wishlist Products', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistView);
  await page.getByRole('button', { name: /^Favorites$/i }).click();
  await expect(page.getByText('Hummingbird wishlist t-shirt', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Add to cart$/i })).toBeVisible();
});
