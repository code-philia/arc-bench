// requirement: REQ-7.7
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.7: Inspect seeded wishlist and products", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_view_user'); const favorite = wishlist(page, 'Favorites'); await expect(favorite).toBeVisible(); await action(favorite, 'Favorites').click();
  const product = wishlistProduct(page); await expect(product).toBeVisible(); await expect(product).toContainText(WISH_PRODUCT); await expect(action(product, 'Add to cart')).toBeVisible();
});

test("REQ-7.7: Create Holiday Picks wishlist", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_create_user'); await action(page, 'Create new wishlist').click(); const dialog = page.getByRole('dialog', { name: 'Create new wishlist', exact: true }); await expect(dialog).toBeVisible();
  await dialog.getByLabel('Name', { exact: true }).fill('Holiday Picks'); await action(dialog, 'Save').click(); await expect(wishlist(page, 'Holiday Picks')).toHaveCount(1); await expect(wishlist(page, 'Holiday Picks')).toBeVisible();
});
