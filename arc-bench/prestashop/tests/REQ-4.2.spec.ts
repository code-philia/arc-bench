// requirement: REQ-4.2
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-4.2: Increase cart quantity", async ({ page }) => {
  await home(page); await cartSetup(page, CART); const row = cartRow(page, CART); await action(row, 'Increase quantity').click();
  await expect(row.getByLabel('Quantity', { exact: true })).toHaveValue('2'); await expectMoney(region(row, 'Subtotal'), 50);
  await expectMoney(region(region(page, 'Cart summary'), 'Total'), 55);
});

test("REQ-4.2: Delete cart product", async ({ page }) => {
  await home(page); await cartSetup(page, CART); await action(cartRow(page, CART), 'Delete').click();
  await expect(cartRow(page, CART)).toHaveCount(0); await expect(page.getByText(/(?:cart is empty|no items in your cart)/i)).toBeVisible();
  await expectMoney(region(region(page, 'Cart summary'), 'Items subtotal'), 0); await expectMoney(region(region(page, 'Cart summary'), 'Total'), 0);
});
