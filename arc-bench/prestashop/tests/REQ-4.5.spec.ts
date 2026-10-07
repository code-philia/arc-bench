// requirement: REQ-4.5
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-4.5: Carry selected variant into cart", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  await page.getByRole('combobox', { name: 'Size', exact: true }).selectOption({ label: 'L' }); await page.getByRole('radio', { name: 'Black', exact: true }).check();
  await page.getByLabel('Quantity', { exact: true }).fill('2'); await action(page, 'Add to cart').click(); await expect(success(page)).toContainText(DETAIL); await action(success(page), 'Proceed to checkout').click();
  const row = cartRow(page, DETAIL); await expect(row).toContainText(/Size\s*:?\s*L/); await expect(row).toContainText(/Color\s*:?\s*Black/); await expect(row.getByLabel('Quantity', { exact: true })).toHaveValue('2');
  await expectMoney(region(row, 'Unit price'), 36); await expectMoney(region(row, 'Subtotal'), 72);
  const summary = region(page, 'Cart summary'); await expectMoney(region(summary, 'Items subtotal'), 72); await expectMoney(region(summary, 'Shipping'), 5); await expectMoney(region(summary, 'Discount'), 18); await expectMoney(region(summary, 'Total'), 77);
});
