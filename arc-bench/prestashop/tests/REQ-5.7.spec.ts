// requirement: REQ-5.7
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.7: Edit shipping address during checkout", async ({ page }) => {
  await home(page); await checkoutSetup(page, 'checkout_address_user', STEP); await action(region(page, 'Addresses'), 'Edit address Home').click();
  await expect(page.getByLabel('Alias', { exact: true })).toHaveValue('Home'); await page.getByLabel('Address', { exact: true }).fill('88 Market Street'); await action(page, 'Save').click();
  const addresses = region(page, 'Addresses'); await expect(addresses).toContainText('88 Market Street'); await expect(region(page, 'Order summary')).toContainText(STEP);
  await addresses.getByRole('radio', { name: 'Home', exact: true }).check(); await action(addresses, 'Continue').click(); await expect(region(page, 'Shipping Method')).toBeVisible();
});
