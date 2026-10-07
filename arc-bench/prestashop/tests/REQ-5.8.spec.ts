// requirement: REQ-5.8
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.8: Reopen completed shipping step", async ({ page }) => {
  await home(page); await checkoutSetup(page, 'checkout_invoice_user', STEP); await paymentStep(page);
  await action(page, 'Edit Shipping Method').click(); const shipping = region(page, 'Shipping Method'); await expect(shipping.getByRole('radio', { name: 'Delivery', exact: true })).toBeChecked();
  await action(shipping, 'Continue').click(); await expect(region(page, 'Payment').getByRole('radio', { name: 'Bank wire', exact: true })).toBeVisible();
  await expect(region(page, 'Order summary')).toContainText(STEP); await expectMoney(region(region(page, 'Order summary'), 'Total'), 31);
  await expect(page.getByRole('heading', { name: 'Order confirmation', exact: true })).toHaveCount(0);
});
