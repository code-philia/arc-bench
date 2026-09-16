import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.4
// fixtures: accounts.wishlistRename, wishlist.favorites

test('REQ-8.6.4: Rename Wishlist', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistRename);
  await page.getByRole('button', { name: /^Rename wishlist$/i }).click();
  await page.getByRole('textbox', { name: /^Wishlist name$/i }).fill('Holiday Picks');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByRole('button', { name: /^Holiday Picks$/i })).toBeVisible();
});
