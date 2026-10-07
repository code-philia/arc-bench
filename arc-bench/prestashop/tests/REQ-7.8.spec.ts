// requirement: REQ-7.8
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.8: Rename Favorites wishlist", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_rename_user'); await createWishlist(page, 'Favorites'); await action(wishlist(page, 'Favorites'), 'Edit').click();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Favorites'); await page.getByLabel('Name', { exact: true }).fill('Holiday Picks'); await action(page, 'Save').click();
  await expect(wishlist(page, 'Holiday Picks')).toHaveCount(1); await expect(wishlist(page, 'Favorites')).toHaveCount(0);
});

test("REQ-7.8: Delete Favorites wishlist", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_delete_user'); await createWishlist(page, 'Favorites'); await expect(wishlist(page, 'Favorites')).toBeVisible();
  await confirmDeletion(page, action(wishlist(page, 'Favorites'), 'Delete')); await expect(wishlist(page, 'Favorites')).toHaveCount(0); await expect(action(page, 'Create new wishlist')).toBeVisible();
});
