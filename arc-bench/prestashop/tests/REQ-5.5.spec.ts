// requirement: REQ-5.5
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.5: Choose bank wire and read terms", async ({ page }) => {
  await home(page); await checkoutSetup(page, 'checkout_invoice_user', STEP); await paymentStep(page);
  const payment = region(page, 'Payment'); const bank = payment.getByRole('radio', { name: 'Bank wire', exact: true }); await expect(bank).toBeVisible(); await bank.check(); await expect(bank).toBeChecked();
  const terms = payment.getByRole('checkbox', { name: 'Terms and conditions', exact: true }); await terms.check(); await expect(terms).toBeChecked();
  await payment.getByRole('link', { name: 'Terms and conditions', exact: true }).click();
  await expect(region(page, 'Terms and conditions')).toBeVisible(); await expect(region(page, 'Terms and conditions')).not.toHaveText(/^\s*$/);
});

test("REQ-5.5: Require terms before completion", async ({ page }) => {
  await home(page); await checkoutSetup(page, 'checkout_invoice_user', STEP); await paymentStep(page); const payment = region(page, 'Payment');
  await payment.getByRole('radio', { name: 'Bank wire', exact: true }).check(); const terms = payment.getByRole('checkbox', { name: 'Terms and conditions', exact: true }); await terms.uncheck();
  const place = action(payment, 'Place order'); if (await place.isEnabled()) await place.click();
  await expect(page.getByRole('heading', { name: 'Order confirmation', exact: true })).toHaveCount(0); await expect(payment).toBeVisible(); await expect(terms).not.toBeChecked();
});
