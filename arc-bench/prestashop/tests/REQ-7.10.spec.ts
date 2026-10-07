// requirement: REQ-7.10
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.10: Delete only the selected address", async ({ page }) => {
  await home(page); await login(page, 'address_delete_user'); await createAddress(page, 'Home'); await createAddress(page, 'Office');
  await confirmDeletion(page, action(page.getByRole('article', { name: 'Home', exact: true }), 'Delete')); await expect(page.getByRole('article', { name: 'Home', exact: true })).toHaveCount(0);
  const office = page.getByRole('article', { name: 'Office', exact: true }); await expect(office).toHaveCount(1); await expect(office).toBeVisible(); await expect(office).toContainText('1 Commerce Road'); await expect(office).toContainText('13800000020');
});
