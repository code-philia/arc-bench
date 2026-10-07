// requirement: REQ-3.2
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.2: Choose M and White", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const size = page.getByRole('combobox', { name: 'Size', exact: true });
  await size.selectOption({ label: 'M' });
  await expect(size.getByRole('option', { name: 'M', exact: true })).toHaveJSProperty('selected', true);
  await page.getByRole('radio', { name: 'White', exact: true }).check();
  await expect(page.getByRole('radio', { name: 'White', exact: true })).toBeChecked();
});

test("REQ-3.2: Adjust and directly enter quantity", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const q = page.getByLabel('Quantity', { exact: true }); await expect(q).toHaveValue('1');
  await action(page, 'Increase quantity').click(); await expect(q).toHaveValue('2');
  await action(page, 'Decrease quantity').click(); await expect(q).toHaveValue('1');
  const decrease = action(page, 'Decrease quantity');
  if (await decrease.isEnabled()) await decrease.click();
  await expect(q).toHaveValue('1');
  await q.fill('3'); await expect(q).toHaveValue('3');
});

test("REQ-3.2: Reject quantity exceeding stock", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  await page.getByLabel('Quantity', { exact: true }).fill('999'); await action(page, 'Add to cart').click();
  await expect(page.getByRole('alert')).toContainText(/(?:insufficient|not enough|exceeds).*stock|stock.*(?:insufficient|not enough)/i);
  await action(nav(page), 'Cart').click(); await expect(cartRow(page, DETAIL)).toHaveCount(0);
});
