// requirement: REQ-3.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.3: Add default product", async ({ page }) => {
  await home(page); await openProduct(page, CART); await expect(page.getByLabel('Quantity', { exact: true })).toHaveValue('1');
  await action(page, 'Add to cart').click(); await expect(success(page)).toBeVisible(); await expect(success(page)).toContainText(CART);
  await expect(action(nav(page), 'Cart')).toContainText('1');
});

test("REQ-3.3: Continue on same product", async ({ page }) => {
  await home(page); await addProduct(page, CART);
  await action(success(page), 'Continue shopping').click(); await expect(success(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: CART, exact: true })).toBeVisible(); await expect(action(page, 'Add to cart')).toBeVisible();
});

test("REQ-3.3: Proceed from confirmation to cart", async ({ page }) => {
  await home(page); await addProduct(page, CART); await action(success(page), 'Proceed to checkout').click();
  await expect(page.getByRole('heading', { name: 'Shopping cart', exact: true })).toBeVisible();
  await expect(cartRow(page, CART)).toBeVisible(); await expectMoney(region(cartRow(page, CART), 'Subtotal'), 25);
});
