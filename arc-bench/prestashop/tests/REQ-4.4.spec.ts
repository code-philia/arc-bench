// requirement: REQ-4.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-4.4: Edit cart quantity directly", async ({ page }) => {
  await home(page); await cartSetup(page, CART); const row = cartRow(page, CART); const quantity = row.getByLabel('Quantity', { exact: true });
  await quantity.fill('3'); await quantity.blur(); await expect(quantity).toHaveValue('3'); await expectMoney(region(row, 'Unit price'), 25);
  await expectMoney(region(row, 'Subtotal'), 75); const summary = region(page, 'Cart summary');
  await expectMoney(region(summary, 'Items subtotal'), 75); await expectMoney(region(summary, 'Total'), 80); await expect(action(nav(page), 'Cart')).toContainText('3');
});
