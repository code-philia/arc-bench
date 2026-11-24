// requirement: REQ-4.1
import { test, expect } from '@playwright/test';
import { home, action, region, expectMoney, cartRow, cartSetup, CART, field } from './helpers';

test("REQ-4.1: Inspect cart row and totals", async ({ page }) => {
  await home(page); await cartSetup(page, CART); const row = cartRow(page, CART);
  await expect(row.getByRole('img', { name: CART, exact: true })).toBeVisible(); await expect(row).toContainText(CART);
  await expect(row).toContainText(/Size\s*:?\s*M/); await expect(row).toContainText(/Color\s*:?\s*White/);
  await expectMoney(region(row, 'Unit price'), 25); await expect(field(row, 'Quantity')).toHaveValue('1');
  await expectMoney(region(row, 'Subtotal'), 25); await expect(action(row, 'Delete')).toBeVisible();
  const summary = region(page, 'Cart summary'); await expectMoney(region(summary, 'Items subtotal'), 25);
  await expectMoney(region(summary, 'Shipping'), 5); await expectMoney(region(summary, 'Total'), 30);
  await expect(summary).toContainText(/tax/i); await expect(region(summary, 'Discount')).toHaveCount(0);
});
