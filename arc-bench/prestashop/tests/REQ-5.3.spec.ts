// requirement: REQ-5.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.3: Save new checkout address", async ({ page }) => {
  await home(page); await login(page, 'checkout_new_address_user'); await cartSetup(page, STEP); await action(page, 'Proceed to checkout').click(); await addressesStep(page);
  await action(region(page, 'Addresses'), 'Add new address').click(); await fillAddress(page, 'Office'); await action(page, 'Save').click();
  await expect(region(page, 'Addresses')).toContainText('Office'); await expect(region(page, 'Addresses')).toContainText('1 Commerce Road');
});
