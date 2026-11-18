// requirement: REQ-3.2
import { test, expect } from '@playwright/test';
import { home, nav, action, openProduct, cartRow, success, DETAIL, field, selectField, chooseOption, choice, setChoice } from './helpers';
import { storefrontInput } from './fixtures/data';

test("REQ-3.2: Choose M and White", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const size = selectField(page, 'Size');
  await chooseOption(size, 'M');

  await setChoice(choice(page, 'radio', 'White'));
  await expect(choice(page, 'radio', 'White')).toBeChecked();
});

test("REQ-3.2: Adjust and directly enter quantity", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const q = field(page, 'Quantity'); await expect(q).toHaveValue('1');
  await action(page, 'Increase quantity').click(); await expect(q).toHaveValue('2');
  await action(page, 'Decrease quantity').click(); await expect(q).toHaveValue('1');
  const decrease = action(page, 'Decrease quantity');
  if (await decrease.isEnabled()) await decrease.click();
  await expect(q).toHaveValue('1');
  const quantity = String(storefrontInput().quantity);
  await q.fill(quantity); await expect(q).toHaveValue(quantity);
});

test("REQ-3.2: Reject quantity exceeding stock", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  await field(page, 'Quantity').fill(String(storefrontInput().beyondStock)); await action(page, 'Add to cart').click();
  await expect(page.getByRole('alert')).toContainText(/(?:insufficient|not enough|exceeds).*stock|stock.*(?:insufficient|not enough)/i);
  await expect(success(page)).toBeHidden();
  await action(nav(page), 'Cart').click(); await expect(cartRow(page, DETAIL)).toHaveCount(0);
});
