// requirement: REQ-7.11
import { test, expect } from '@playwright/test';
import { home, action, wishlistPage, createWishlist, wishlist, wishlistOpening, confirmDeletion } from './helpers';
import { wishlistInput } from './fixtures/data';

test("REQ-7.11: Delete only the selected wishlist", async ({ page }) => {
  await home(page);
  await wishlistPage(page, 'wishlist_delete_user');
  const target = wishlistInput();
  const other = wishlistInput();
  await createWishlist(page, target);
  await createWishlist(page, other);
  await confirmDeletion(page, action(wishlist(page, target), 'Delete'));
  await expect(wishlist(page, target)).toHaveCount(0);
  await expect(wishlist(page, other)).toHaveCount(1);
  await expect(wishlist(page, other)).toBeVisible();
  await wishlistOpening(page, other).click();
  await expect(page.getByRole('heading', { name: other, exact: true })).toBeVisible();
});
