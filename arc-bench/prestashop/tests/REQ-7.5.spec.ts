// requirement: REQ-7.5
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.5: Inspect historical order list", async ({ page }) => {
  await home(page); await history(page); const row = historyRow(page); await expect(row).toHaveCount(1);
  for (const text of ['PS-HISTORY-001', HISTORY_PRODUCT, '2026-07-18', 'Delivered']) await expect(row).toContainText(text); await expectMoney(region(row, 'Total'), 34);
  await expect(region(page, 'Order history').getByRole('row').filter({ has: page.getByRole('button', { name: /^details$/i }).or(page.getByRole('link', { name: /^details$/i })) })).toHaveCount(1);
});

test("REQ-7.5: Inspect selected order details", async ({ page }) => {
  await home(page); await history(page); await action(historyRow(page), 'Details').click(); const details = region(page, 'Order details');
  for (const text of [HISTORY_PRODUCT, '1 Commerce Road', 'Shanghai', '200000', 'China', 'Bank wire']) await expect(details).toContainText(text);
});
