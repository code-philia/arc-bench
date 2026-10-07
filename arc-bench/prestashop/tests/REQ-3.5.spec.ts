// requirement: REQ-3.5
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.5: Read existing review", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); const reviews = region(page, 'Reviews'); await reviews.scrollIntoViewIfNeeded();
  await expect(reviews).toContainText('Good fit'); await expect(reviews).toContainText(/Average rating\s*:?\s*4(?:\.0)?/i);
});

test("REQ-3.5: Require sign-in before review", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); const reviews = region(page, 'Reviews');
  await reviews.scrollIntoViewIfNeeded(); const before = await reviews.innerText(); await action(reviews, 'Write your review').click();
  const prompt = page.getByRole('dialog', { name: 'Sign in required', exact: true }); await expect(prompt).toBeVisible(); await expect(prompt).toContainText(DETAIL);
  await expect(reviews).toHaveText(before, { useInnerText: true });
});

test("REQ-3.5: Require sign-in before wishlist", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); await action(page, 'Wishlist').click();
  const prompt = page.getByRole('dialog', { name: 'Sign in required', exact: true }); await expect(prompt).toBeVisible(); await expect(prompt).toContainText(DETAIL);
  await expect(action(nav(page), 'Sign in')).toBeVisible(); await expect(action(nav(page), 'Sign out')).toHaveCount(0);
});
