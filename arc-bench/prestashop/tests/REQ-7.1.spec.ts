// requirement: REQ-7.1
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.1: Inspect account overview", async ({ page }) => {
  await home(page); await login(page, 'user'); await account(page); await expect(page.getByRole('heading', { name: 'My account', exact: true })).toBeVisible();
  await expect(region(page, 'Account overview')).toContainText('Store User'); for (const name of ['Information', 'Addresses', 'Order history and details', 'Wishlist']) await expect(action(region(page, 'Account overview'), name)).toBeVisible();
});
