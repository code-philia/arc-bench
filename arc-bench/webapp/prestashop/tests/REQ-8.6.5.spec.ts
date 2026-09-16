import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.5
// fixtures: accounts.wishlistDelete, wishlist.favorites

test('REQ-8.6.5: Delete Wishlist', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistDelete);
  await page.getByRole('button', { name: /^Delete wishlist$/i }).click();
  await expect(page.getByText(/^Wishlist deleted\.$/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /^Favorites$/i })).toHaveCount(0);
});
