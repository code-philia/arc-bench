// requirement: REQ-7.11
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.11: Delete only the selected wishlist", async ({ page }) => {
  await home(page); await wishlistPage(page, 'wishlist_delete_user'); await createWishlist(page, 'Favorites'); await createWishlist(page, 'Holiday Picks');
  await confirmDeletion(page, action(wishlist(page, 'Favorites'), 'Delete')); await expect(wishlist(page, 'Favorites')).toHaveCount(0);
  const remaining = wishlist(page, 'Holiday Picks'); await expect(remaining).toHaveCount(1); await expect(remaining).toBeVisible(); await expect(action(remaining, 'Holiday Picks')).toBeVisible();
  await action(remaining, 'Holiday Picks').click();
  await expect(page.getByRole('heading', { name: 'Holiday Picks', exact: true })).toBeVisible();
});
