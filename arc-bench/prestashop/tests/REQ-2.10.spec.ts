// requirement: REQ-2.10
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-2.10: Combine filters and clear them", async ({ page }) => {
  await home(page); await men(page);
  const before = await count(page).innerText();
  const products = region(page, 'Product list').getByRole('region', { name: /^Product / });
  const identities = await products.allTextContents();
  const stock = page.getByRole('checkbox', { name: 'In stock', exact: true }); await stock.check();
  const minimum = page.getByLabel('Minimum price', { exact: true }); await minimum.fill('25'); await minimum.blur();
  await expect(stock).toBeChecked(); await expect(minimum).toHaveValue('25');
  await expect(card(page, CART)).toBeVisible(); await expect(card(page, WHITE)).toHaveCount(0); await expect(card(page, BLACK)).toHaveCount(0);
  await expect.poll(async () => (await listingPrices(page)).every(p => p >= 25)).toBe(true);
  await action(page, 'Clear all').click(); await expect(stock).not.toBeChecked(); await expect(minimum).toHaveValue(/^(?:0)?$/);
  await expect(count(page)).toHaveText(before); await expect(products).toHaveText(identities);
});
