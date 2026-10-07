// requirement: REQ-7.9
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.9: Remove Favorites product", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_remove_user'); await action(wishlist(page, 'Favorites'), 'Favorites').click(); await expect(wishlistProduct(page)).toBeVisible();
  await confirmDeletion(page, action(wishlistProduct(page), 'Remove')); await expect(wishlistProduct(page)).toHaveCount(0);
});

test("REQ-7.9: Add Favorites product to cart", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_cart_user'); await action(wishlist(page, 'Favorites'), 'Favorites').click(); await action(wishlistProduct(page), 'Add to cart').click();
  await expect(action(nav(page), 'Cart')).toContainText(/\b1\b/);
  if (await success(page).isVisible()) await action(success(page), 'Continue shopping').click();
  await action(nav(page), 'Cart').click(); await expect(cartRow(page, WISH_PRODUCT)).toBeVisible();
});
