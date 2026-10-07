// requirement: REQ-5.9
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.9: Collapse completed address step and reopen it", async ({ page }) => {
  await home(page); await checkoutSetup(page, 'checkout_address_user', STEP);
  const addresses = region(page, 'Addresses'); const choice = addresses.getByRole('radio', { name: 'Home', exact: true }); await choice.check(); await action(addresses, 'Continue').click();
  await expect(choice).not.toBeVisible(); await expect(action(page, 'Edit Addresses')).toBeVisible(); await expect(region(page, 'Shipping Method').getByRole('radio', { name: 'Delivery', exact: true })).toBeVisible();
  await action(page, 'Edit Addresses').click(); await expect(choice).toBeVisible(); await expect(choice).toBeChecked(); await expect(region(page, 'Order summary')).toContainText(STEP);
});
