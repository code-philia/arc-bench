// requirement: REQ-1.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-1.3: Suggest and search shirt", async ({ page }) => {
  await home(page);
  const search = nav(page).getByRole('searchbox', { name: 'Search', exact: true });
  await search.focus(); await expect(search).toBeFocused();
  await search.fill('shirt');
  await expect(region(page, 'Search suggestions').getByText(DETAIL, { exact: true })).toBeVisible();
  await search.press('Enter');
  await expect(card(page, DETAIL)).toBeVisible();
});
