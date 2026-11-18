// requirement: REQ-7.10
import { test, expect } from '@playwright/test';
import { home, action, loginCustomer, createAddress, addressRecord, confirmDeletion } from './helpers';
import { addressInput } from './fixtures/data';

test("REQ-7.10: Delete only the selected address", async ({ page }) => {
  await home(page);
  const customer = await loginCustomer(page);
  const target = addressInput(customer, 'Primary');
  const other = addressInput(customer, 'Secondary');
  await createAddress(page, target);
  await createAddress(page, other);
  const removed = addressRecord(page, target.alias);
  await confirmDeletion(page, action(removed, 'Delete'));
  await expect(removed).toHaveCount(0);
  const remaining = addressRecord(page, other.alias);
  await expect(remaining).toHaveCount(1);
  await expect(remaining).toBeVisible();
  for (const value of [other.Address, other.Phone]) await expect(remaining).toContainText(value);
});
