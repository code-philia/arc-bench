// requirement: REQ-3.1
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.1: Inspect selected product", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  await expect(page.getByRole('heading', { name: DETAIL, exact: true })).toBeVisible();
  await expect(action(page, 'Add to cart')).toBeVisible();
  const images = region(page, 'Product images');
  await expect(images.getByRole('img', { name: DETAIL, exact: true })).toHaveCount(1);
  await expect(images.getByRole('img', { name: DETAIL, exact: true })).toBeVisible();
  await expect(action(images, 'Zoom')).toBeVisible();
  const info = region(page, 'Product information'); await expect(info).toContainText(DETAIL);
  await expectMoney(region(info, 'Sale price'), 24); await expectMoney(region(info, 'Regular price'), 30);
  await expect(info).toContainText('20%'); await expect(info).toContainText(/tax/i); await expect(info).toContainText(/regular.fit/i);
});
