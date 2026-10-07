// requirement: REQ-1.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-1.4: Advance automatically", async ({ page }) => {
  await home(page);
  const before = await slideIdentity(page);
  await expect.poll(() => slideIdentity(page), { timeout: 5_000, intervals: [50, 100] }).not.toEqual(before);
});

test("REQ-1.4: Advance with Next", async ({ page }) => {
  await home(page);
  const before = await slideIdentity(page);
  await action(region(page, 'Carousel'), 'Next').click();
  await expect.poll(() => slideIdentity(page), { timeout: 2_000 }).not.toEqual(before);
});

test("REQ-1.4: Shop from promotion", async ({ page }) => {
  await home(page);
  await action(region(page, 'Carousel'), 'Shop now').click();
  await expect(page.getByRole('heading', { name: DETAIL, exact: true }).or(page.getByRole('heading', { name: 'Men', exact: true }))).toBeVisible();
  await expect(page.getByRole('heading', { name: DETAIL, exact: true }).or(card(page, DETAIL))).toBeVisible();
});
