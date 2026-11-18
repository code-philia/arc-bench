// requirement: REQ-2.2
import { test, expect } from '@playwright/test';
import { home, action, region, card, tabTo, men, expectMoney, DETAIL } from './helpers';

test("REQ-2.2: Inspect card and hover actions", async ({ page }) => {
  await home(page); await men(page);
  const product = card(page, DETAIL);
  await expect(product.getByRole('img', { name: DETAIL, exact: true })).toBeVisible();
  await expect(action(product, DETAIL)).toBeVisible();
  await expect(product.getByText('Sale', { exact: true })).toBeVisible();
  await expectMoney(region(product, 'Sale price'), 24); await expectMoney(region(product, 'Regular price'), 30);
  await product.hover();
  for (const name of ['Quick view', 'Wishlist', 'White']) await expect(action(product, name)).toBeVisible();
});

test("REQ-2.2: Open card using keyboard", async ({ page }) => {
  await home(page); await men(page);
  await tabTo(page, action(card(page, DETAIL), DETAIL)); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: DETAIL, exact: true })).toBeVisible();
  await expect(action(page, 'Add to cart')).toBeVisible();
});
