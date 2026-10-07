// requirement: REQ-1.5
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-1.5: Open popular t-shirt", async ({ page }) => {
  await home(page);
  await action(region(page, 'Popular Products'), DETAIL).click();
  await expect(page.getByRole('heading', { name: DETAIL, exact: true })).toBeVisible();
  await expect(action(page, 'Add to cart')).toBeVisible();
});
