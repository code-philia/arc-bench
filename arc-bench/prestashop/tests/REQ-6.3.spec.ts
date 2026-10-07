// requirement: REQ-6.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-6.3: Request existing-account reset", async ({ page }) => {
  await home(page); await action(nav(page), 'Sign in').click(); await action(page, 'Forgot your password?').click();
  await page.getByLabel('Email', { exact: true }).fill('prestashop_user@example.com'); await expect(page.getByLabel('Email', { exact: true })).toHaveValue('prestashop_user@example.com');
  await action(page, 'Send').click(); const message = page.getByRole('status', { name: 'Password reset confirmation', exact: true });
  await expect(message).toContainText('prestashop_user@example.com'); await expect(message).toContainText(/(?:sent|send).*email|email.*(?:sent|send)/i);
});
