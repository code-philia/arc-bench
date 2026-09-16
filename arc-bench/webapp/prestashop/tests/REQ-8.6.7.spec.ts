import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.7
// fixtures: accounts.wishlistCart, wishlist.favorites, products.wishlist

test('REQ-8.6.7: Add Wishlist Product to Cart', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistCart);
  await page.getByRole('button', { name: /^Favorites$/i }).click();
  await page.getByRole('button', { name: /^Add to cart$/i }).click();
  await expect(page.getByText(/^Hummingbird wishlist t-shirt was added to your cart\.$/i)).toBeVisible();
});
