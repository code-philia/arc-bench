// requirement: REQ-6.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-6.4: Sign out from account", async ({ page }) => {
  await home(page); await login(page, 'user'); await account(page); await action(nav(page), 'Sign out').click();
  await expect(action(nav(page), 'Sign in')).toBeVisible(); await expect(action(nav(page), 'Cart')).toBeVisible(); await expect(action(nav(page), 'Sign out')).toHaveCount(0);
  await expect(action(region(page, 'Popular Products'), DETAIL)).toBeVisible();
});
