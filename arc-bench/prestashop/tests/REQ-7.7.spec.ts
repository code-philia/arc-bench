// requirement: REQ-7.7
import { test, expect } from '@playwright/test';
import { home, action, wishlistPage, createWishlist, wishlist, wishlistProduct, wishlistOpening, WISH_PRODUCT } from './helpers';
import { wishlistInput } from './fixtures/data';

test("REQ-7.7: Inspect seeded wishlist and products", async ({ page }) => {
  await home(page);
  await wishlistPage(page, 'wishlistView');
  await expect(wishlist(page, 'Favorites')).toBeVisible();
  await wishlistOpening(page, 'Favorites').click();
  const product = wishlistProduct(page);
  await expect(product).toBeVisible();
  await expect(product).toContainText(WISH_PRODUCT);
  await expect(action(product, 'Add to cart')).toBeVisible();
});

test("REQ-7.7: Create Holiday Picks wishlist", async ({ page }) => {
  await home(page);
  await wishlistPage(page);
  const name = wishlistInput();
  await createWishlist(page, name);
  const record = wishlist(page, name);
  await expect(wishlistOpening(page, name)).toBeVisible();
  for (const command of ['Edit', 'Delete']) await expect(action(record, command)).toBeVisible();
});
