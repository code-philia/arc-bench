// requirement: REQ-7.6
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, count, tabTo, men, openProduct, slideIdentity, expectMoney, listingPrices, cartRow, success, addProduct, cartSetup, login, loginEmail, account, createAddress, fillAddress, addressesStep, checkoutSetup, shippingStep, paymentStep, placeOrder, confirmDeletion, history, historyRow, wishlistPage, createWishlist, wishlist, wishlistProduct, DETAIL, CART, STEP, WHITE, BLACK, HISTORY_PRODUCT, WISH_PRODUCT } from './helpers';

test("REQ-7.6: Reorder historical product", async ({ page }) => {
  await home(page); await history(page); await action(historyRow(page), 'Reorder').click();
  await expect(page.getByRole('heading', { name: 'Shopping cart', exact: true })).toBeVisible(); await expect(cartRow(page, HISTORY_PRODUCT)).toBeVisible(); await expectMoney(region(cartRow(page, HISTORY_PRODUCT), 'Subtotal'), 29);
});

test("REQ-7.6: Download historical invoice", async ({ page }) => {
  await home(page); await history(page); const pending = page.waitForEvent('download'); await action(historyRow(page), 'PDF').click(); const download = await pending;
  expect(await download.failure()).toBeNull(); expect(download.suggestedFilename()).toMatch(/PS-HISTORY-001.*\.pdf$/i);
  const stream = await download.createReadStream(); if (!stream) throw new Error('Missing invoice download stream');
  const chunks: Buffer[] = []; for await (const chunk of stream) chunks.push(Buffer.from(chunk)); expect(Buffer.concat(chunks).subarray(0, 5).toString()).toBe('%PDF-');
});
