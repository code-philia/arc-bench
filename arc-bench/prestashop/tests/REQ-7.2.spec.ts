// requirement: REQ-7.2
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.2: Save email then password", async ({ page }) => {
  await home(page); await login(page, 'profile_user'); await account(page); await action(region(page, 'Account overview'), 'Information').click();
  await page.getByLabel('Current password', { exact: true }).fill('ShopPass123!'); await page.getByLabel('Email', { exact: true }).fill('prestashop_profile_user_next@example.com'); await action(page, 'Save').click();
  await expect(page.getByRole('status', { name: 'Profile update', exact: true })).toContainText(/saved|updated/i); await expect(page.getByLabel('Email', { exact: true })).toHaveValue('prestashop_profile_user_next@example.com');
  await page.getByLabel('Current password', { exact: true }).fill('ShopPass123!'); await page.getByLabel('New password', { exact: true }).fill('ShopPass456!'); await action(page, 'Save').click();
  await expect(page.getByRole('status', { name: 'Profile update', exact: true })).toContainText(/saved|updated/i);
  await action(nav(page), 'Sign out').click(); await loginEmail(page, 'prestashop_profile_user_next@example.com', 'ShopPass456!'); await expect(action(nav(page), 'My account')).toBeVisible();
});
