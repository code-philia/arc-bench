// requirement: REQ-7.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.3: View Home address", async ({ page }) => {
  await home(page); await login(page, 'address_view_user'); await createAddress(page, 'Home'); await account(page); await action(region(page, 'Account overview'), 'Addresses').click();
  await expect(page.getByRole('article', { name: 'Home', exact: true })).toBeVisible(); await expect(page.getByRole('article', { name: 'Home', exact: true })).toContainText('1 Commerce Road');
});

test("REQ-7.3: Create Office address", async ({ page }) => {
  await home(page); await login(page, 'address_create_user'); await account(page); await action(region(page, 'Account overview'), 'Addresses').click();
  await expect(page.getByRole('article')).toHaveCount(0); await action(page, 'Create new address').click(); await fillAddress(page, 'Office'); await action(page, 'Save').click();
  const office = page.getByRole('article', { name: 'Office', exact: true }); await expect(office).toHaveCount(1); await expect(office).toBeVisible();
  for (const text of ['Store', 'User', '1 Commerce Road', '200000', 'Shanghai', 'China', '13800000020']) await expect(office).toContainText(text);
});
