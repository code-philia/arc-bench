// requirement: REQ-5.1
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.1: Start anonymous checkout", async ({ page }) => {
  await home(page); await cartSetup(page, STEP); await action(page, 'Proceed to checkout').click();
  await expect(region(page, 'Personal Information')).toBeVisible(); await expect(region(page, 'Order summary')).toContainText(STEP);
});

test("REQ-5.1: Inspect signed-in customer", async ({ page }) => {
  await home(page); await login(page, 'checkout_user'); await createAddress(page, 'Home'); await cartSetup(page, STEP); await action(page, 'Proceed to checkout').click();
  await expect(region(page, 'Personal Information')).toContainText('prestashop_checkout_user@example.com'); await addressesStep(page);
  await expect(region(page, 'Addresses')).toBeVisible();
});
