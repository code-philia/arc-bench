// requirement: REQ-4.2
import { test, expect } from '@playwright/test';
import { home, action, region, expectMoney, cartRow, cartSetup, emptyCartMessage, CART, field } from './helpers';

test("REQ-4.2: Increase cart quantity", async ({ page }) => {
  await home(page); await cartSetup(page, CART); const row = cartRow(page, CART); await action(row, 'Increase quantity').click();
  await expect(field(row, 'Quantity')).toHaveValue('2'); await expectMoney(region(row, 'Subtotal'), 50);
  await expectMoney(region(region(page, 'Cart summary'), 'Total'), 55);
});

test("REQ-4.2: Delete cart product", async ({ page }) => {
  await home(page); await cartSetup(page, CART); await action(cartRow(page, CART), 'Delete').click();
  await expect(cartRow(page, CART)).toHaveCount(0); await expect(emptyCartMessage(page)).toBeVisible();
  await expectMoney(region(region(page, 'Cart summary'), 'Items subtotal'), 0); await expectMoney(region(region(page, 'Cart summary'), 'Total'), 0);
});
