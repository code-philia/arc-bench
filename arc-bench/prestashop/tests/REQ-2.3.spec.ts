// requirement: REQ-2.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-2.3: Filter in-stock products", async ({ page }) => {
  await home(page); await men(page);
  await page.getByRole('checkbox', { name: 'In stock', exact: true }).check();
  await expect(card(page, WHITE)).toBeVisible(); await expect(card(page, BLACK)).toHaveCount(0);
});

test("REQ-2.3: Filter White color", async ({ page }) => {
  await home(page); await men(page);
  await page.getByRole('checkbox', { name: 'White', exact: true }).check();
  await expect(card(page, WHITE)).toBeVisible(); await expect(card(page, BLACK)).toHaveCount(0);
});

test("REQ-2.3: Filter minimum price", async ({ page }) => {
  await home(page); await men(page);
  const before = await count(page).innerText();
  await page.getByLabel('Minimum price', { exact: true }).fill('20');
  await page.getByLabel('Minimum price', { exact: true }).blur();
  await expect(count(page)).not.toHaveText(before);
  await expect(card(page, WHITE)).toBeVisible(); await expect(card(page, BLACK)).toHaveCount(0);
  await expect.poll(async () => (await listingPrices(page)).every(p => p >= 20)).toBe(true);
});

test("REQ-2.3: Clear applied filters", async ({ page }) => {
  await home(page); await men(page);
  const before = await count(page).innerText();
  const stock = page.getByRole('checkbox', { name: 'In stock', exact: true }); await stock.check();
  await expect(card(page, BLACK)).toHaveCount(0); await expect(card(page, WHITE)).toBeVisible();
  await action(page, 'Clear all').click();
  await expect(stock).not.toBeChecked();
  await expect(card(page, BLACK)).toBeVisible(); await expect(card(page, WHITE)).toBeVisible();
  await expect(count(page)).toHaveText(before);
});
