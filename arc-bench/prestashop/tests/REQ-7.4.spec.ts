// requirement: REQ-7.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.4: Update Home street", async ({ page }) => {
  await home(page); await login(page, 'address_edit_user'); await createAddress(page, 'Home'); const homeAddress = page.getByRole('article', { name: 'Home', exact: true }); await action(homeAddress, 'Update').click();
  await expect(page.getByLabel('Alias', { exact: true })).toHaveValue('Home'); await expect(page.getByLabel('Address', { exact: true })).toHaveValue('1 Commerce Road');
  await page.getByLabel('Address', { exact: true }).fill('88 Market Street'); await action(page, 'Save').click(); await expect(homeAddress).toContainText('88 Market Street');
});

test("REQ-7.4: Delete Home address", async ({ page }) => {
  await home(page); await login(page, 'address_delete_user'); await createAddress(page, 'Home'); const address = page.getByRole('article', { name: 'Home', exact: true }); await expect(address).toBeVisible();
  await confirmDeletion(page, action(address, 'Delete')); await expect(address).toHaveCount(0); await expect(action(page, 'Create new address')).toBeVisible();
});
