// requirement: REQ-5.6
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-5.6: Place order for selected product", async ({ page }) => {
  await home(page); const product = 'Hummingbird order-confirmation t-shirt'; await checkoutSetup(page, 'checkout_6_6_user', product); await paymentStep(page); await placeOrder(page);
  await expect(page.getByRole('heading', { name: 'Order confirmation', exact: true })).toBeVisible(); await expect(region(page, 'Order details')).toContainText(product);
});

test("REQ-5.6: Inspect completed order and continue shopping", async ({ page }) => {
  await home(page); const product = 'Hummingbird order-complete t-shirt'; await checkoutSetup(page, 'checkout_6_7_user', product); await paymentStep(page); await placeOrder(page);
  await expect(page.getByRole('heading', { name: 'Order confirmation', exact: true })).toBeVisible(); await expect(region(page, 'Order reference')).toContainText(/\S+/);
  const details = region(page, 'Order details'); for (const text of [product, 'Delivery', 'Bank wire', '1 Commerce Road']) await expect(details).toContainText(text);
  await expect(details).toContainText(/Quantity\s*:?\s*1/); await expectMoney(region(details, 'Total'), 33);
  await action(page, 'Continue shopping').click(); await expect(page.getByRole('heading', { name: 'Popular Products', exact: true })).toBeVisible();
  await expect(nav(page).getByRole('searchbox', { name: 'Search', exact: true })).toBeVisible(); for (const name of ['My account', 'Cart']) await expect(action(nav(page), name)).toBeVisible();
});
