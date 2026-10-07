// requirement: REQ-3.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.4: Read description tab", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await page.getByRole('tab', { name: 'Description', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'Description', exact: true })).toContainText(/regular.fit/i);
});

test("REQ-3.4: Read details tab", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await page.getByRole('tab', { name: 'Product Details', exact: true }).click();
  const panel = page.getByRole('tabpanel', { name: 'Product Details', exact: true });
  for (const text of ['Reference', 'HB-DETAIL', 'Data sheet', 'cotton', 'Features']) await expect(panel).toContainText(text);
  await expect(panel).toContainText(/regular.fit/i);
});
