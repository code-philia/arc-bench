// requirement: REQ-4.5
import { test, expect } from '@playwright/test';
import { home, action, region, openProduct, expectMoney, cartRow, success, DETAIL, field, selectField, chooseOption, choice, setChoice } from './helpers';

test("REQ-4.5: Carry selected variant into cart", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  await chooseOption(selectField(page, 'Size'), 'L'); await setChoice(choice(page, 'radio', 'Black'));
  await field(page, 'Quantity').fill('2'); await action(page, 'Add to cart').click(); await expect(success(page)).toContainText(DETAIL); await action(success(page), 'Proceed to checkout').click();
  const row = cartRow(page, DETAIL); await expect(row).toContainText(/Size\s*:?\s*L/); await expect(row).toContainText(/Color\s*:?\s*Black/); await expect(field(row, 'Quantity')).toHaveValue('2');
  await expectMoney(region(row, 'Unit price'), 36); await expectMoney(region(row, 'Subtotal'), 72);
  const summary = region(page, 'Cart summary'); await expectMoney(region(summary, 'Items subtotal'), 72); await expectMoney(region(summary, 'Shipping'), 5); await expectMoney(region(summary, 'Discount'), 18); await expectMoney(region(summary, 'Total'), 77);
});
