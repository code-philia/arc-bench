// requirement: REQ-2.9
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-2.9: Filter product brand", async ({ page }) => {
  await home(page); await men(page);
  const before = await count(page).innerText();
  const filter = region(page, 'Filters').getByRole('checkbox', { name: 'Hummingbird', exact: true });
  await filter.check(); await expect(filter).toBeChecked();
  await expect(card(page, 'Hummingbird detail t-shirt')).toBeVisible();
  await expect(card(page, 'White t-shirt')).toHaveCount(0);
  await expect(count(page)).not.toHaveText(before);
});
