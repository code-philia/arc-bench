// requirement: REQ-2.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-2.4: Sort current prices ascending", async ({ page }) => {
  await home(page); await men(page);
  const sort = page.getByRole('combobox', { name: 'Sort by', exact: true });
  await sort.selectOption({ label: 'Price, low to high' });
  await expect(sort.getByRole('option', { name: 'Price, low to high', exact: true })).toHaveJSProperty('selected', true);
  await expect(card(page, WHITE)).toBeVisible();
  await expect.poll(async () => { const p = await listingPrices(page); return p.length >= 2 && p.every((v, i) => i === 0 || p[i - 1] <= v); }).toBe(true);
});
