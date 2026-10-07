// requirement: REQ-6.2
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-6.2: Create new customer", async ({ page }) => {
  await home(page); await action(nav(page), 'Sign in').click(); await action(page, 'No account? Create one here').click();
  const mr = page.getByRole('radio', { name: 'Mr.', exact: true }); await mr.check(); await expect(mr).toBeChecked();
  const values = { 'First name': 'New', 'Last name': 'Customer', Email: 'new_customer_7_3@example.com', Password: 'ShopPass123!', Birthdate: '1995-08-21' };
  for (const [name, value] of Object.entries(values)) { await page.getByLabel(name, { exact: true }).fill(value); await expect(page.getByLabel(name, { exact: true })).toHaveValue(value); }
  for (const name of ['Receive offers', 'Newsletter', 'Terms']) { const c = page.getByRole('checkbox', { name, exact: true }); await c.check(); await expect(c).toBeChecked(); }
  await action(page, 'Save').click(); await expect(page.getByText('New Customer', { exact: true })).toBeVisible(); await expect(action(nav(page), 'My account')).toBeVisible();
});
