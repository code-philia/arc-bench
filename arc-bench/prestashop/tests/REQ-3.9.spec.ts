// requirement: REQ-3.9
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.9: Update price and stock for selected variant", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); const size = page.getByRole('combobox', { name: 'Size', exact: true });
  const info = region(page, 'Product information'); await expectMoney(region(info, 'Sale price'), 24);
  await size.selectOption({ label: 'L' }); await page.getByRole('radio', { name: 'Black', exact: true }).check();
  await expect(size.getByRole('option', { name: 'L', exact: true })).toHaveJSProperty('selected', true); await expect(page.getByRole('radio', { name: 'Black', exact: true })).toBeChecked();
  await expectMoney(region(info, 'Sale price'), 36); await expectMoney(region(info, 'Regular price'), 45);
  await expect(info.getByRole('status', { name: 'Stock', exact: true })).toHaveText('Available stock: 2');
  await size.selectOption({ label: 'M' }); await page.getByRole('radio', { name: 'White', exact: true }).check();
  await expectMoney(region(info, 'Sale price'), 24); await expectMoney(region(info, 'Regular price'), 30);
  await expect(info.getByRole('status', { name: 'Stock', exact: true })).toHaveText('Available stock: 50');
});
