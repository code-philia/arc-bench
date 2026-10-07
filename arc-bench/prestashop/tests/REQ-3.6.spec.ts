// requirement: REQ-3.6
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-3.6: Inspect recommendations and viewing history", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const recent = region(page, 'Recently viewed'); await recent.scrollIntoViewIfNeeded(); await expect(recent.getByText(DETAIL, { exact: true })).toBeVisible();
  const related = region(page, 'Related products'); await related.scrollIntoViewIfNeeded();
  const names = ['Hummingbird cart t-shirt', 'Hummingbird checkout-step t-shirt', 'Hummingbird order-confirmation t-shirt', 'Hummingbird order-complete t-shirt', 'Hummingbird order-history t-shirt', 'Hummingbird wishlist t-shirt', WHITE, BLACK, ...[1,2,3,4].map(i => `Catalog item ${i}`)];
  await expect.poll(async () => { for (const name of names) if (await action(related, name).isVisible()) return true; return false; }).toBe(true);
});
