// requirement: REQ-3.9
import { test, expect } from '@playwright/test';
import { home, region, openProduct, expectMoney, DETAIL, selectField, chooseOption, choice, setChoice } from './helpers';

test("REQ-3.9: Update price and stock for selected variant", async ({ page }) => {
  await home(page); await openProduct(page, DETAIL); const size = selectField(page, 'Size');
  const info = region(page, 'Product information'); await expectMoney(region(info, 'Sale price'), 24);
  await chooseOption(size, 'L'); await setChoice(choice(page, 'radio', 'Black'));
await expect(choice(page, 'radio', 'Black')).toBeChecked();
  await expectMoney(region(info, 'Sale price'), 36); await expectMoney(region(info, 'Regular price'), 45);
  await expect(info.getByRole('status', { name: 'Stock', exact: true })).toHaveText('Available stock: 2');
  await chooseOption(size, 'M'); await setChoice(choice(page, 'radio', 'White'));
  await expectMoney(region(info, 'Sale price'), 24); await expectMoney(region(info, 'Regular price'), 30);
  await expect(info.getByRole('status', { name: 'Stock', exact: true })).toHaveText('Available stock: 50');
});
