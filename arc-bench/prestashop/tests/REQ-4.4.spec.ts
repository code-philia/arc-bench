// requirement: REQ-4.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, expectMoney, cartRow, cartSetup, field, CART } from './helpers';
import { storefrontInput } from './fixtures/data';

test("REQ-4.4: Edit cart quantity directly", async ({ page }) => {
  const { quantity } = storefrontInput();
  await home(page);
  await cartSetup(page, CART);
  const row = cartRow(page, CART);
  const input = field(row, 'Quantity');
  await input.fill(String(quantity));
  await input.blur();
  await expect(input).toHaveValue(String(quantity));
  await expectMoney(region(row, 'Unit price'), 25);
  await expectMoney(region(row, 'Subtotal'), 25 * quantity);
  const summary = region(page, 'Cart summary');
  await expectMoney(region(summary, 'Items subtotal'), 25 * quantity);
  await expectMoney(region(summary, 'Total'), 25 * quantity + 5);
  await expect(action(nav(page), 'Cart')).toContainText(new RegExp('\\b' + quantity + '\\b'));
});
