// requirement: REQ-7.9
import { test, expect } from '@playwright/test';
import { home, signedInNav, action, success, cartRow, wishlistPage, wishlistProduct, wishlistOpening, confirmDeletion, WISH_PRODUCT } from './helpers';

test("REQ-7.9: Remove Favorites product", async ({ page }) => {
  await home(page);
  await wishlistPage(page, 'wishlist_remove_user');
  await wishlistOpening(page, 'Favorites').click();
  const product = wishlistProduct(page);
  await expect(product).toBeVisible();
  await confirmDeletion(page, action(product, 'Remove'));
  await expect(product).toHaveCount(0);
});

test("REQ-7.9: Add Favorites product to cart", async ({ page }) => {
  await home(page);
  await wishlistPage(page, 'wishlist_cart_user');
  await wishlistOpening(page, 'Favorites').click();
  await action(wishlistProduct(page), 'Add to cart').click();
  const cart = action(await signedInNav(page), 'Cart');
  await expect(cart).toContainText(/\b1\b/);
  if (await success(page).isVisible()) await action(success(page), 'Continue shopping').click();
  if (!(await cartRow(page, WISH_PRODUCT).isVisible())) await cart.click();
  await expect(cartRow(page, WISH_PRODUCT)).toBeVisible();
});
