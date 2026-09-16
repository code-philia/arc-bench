import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.6.2
// fixtures: accounts.wishlistCreate

test('REQ-8.6.2: Create New Wishlist', async ({ page }) => {
  await h.openWishlists(page, h.FIXTURES.accounts.wishlistCreate);
  await page.getByRole('button', { name: /^Create new wishlist$/i }).click();
  await expect(page.getByRole('heading', { name: /^Create new wishlist$/i })).toBeVisible();
  await page.getByRole('textbox', { name: /^Wishlist name$/i }).fill('Holiday Picks');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByRole('button', { name: /^Holiday Picks$/i })).toBeVisible();
});
