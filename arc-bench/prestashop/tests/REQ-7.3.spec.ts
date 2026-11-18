// requirement: REQ-7.3
import { test, expect } from '@playwright/test';
import { home, action, region, loginCustomer, account, createAddress, fillAddress, addressRecord } from './helpers';
import { addressInput } from './fixtures/data';

test("REQ-7.3: View Home address", async ({ page }) => {
  await home(page);
  const customer = await loginCustomer(page);
  const address = addressInput(customer);
  await createAddress(page, address);
  await account(page);
  await action(region(page, 'Account overview'), 'Addresses').click();
  const record = addressRecord(page, address.alias);
  await expect(record).toBeVisible();
  await expect(record).toContainText(address.Address);
  for (const command of ['Update', 'Delete']) await expect(action(record, command)).toBeVisible();
});

test("REQ-7.3: Create Office address", async ({ page }) => {
  await home(page);
  const customer = await loginCustomer(page);
  await account(page);
  await action(region(page, 'Account overview'), 'Addresses').click();
  await expect(action(page, 'Update')).toHaveCount(0);
  await action(page, 'Create new address').click();
  const address = addressInput(customer, 'Workplace');
  const form = await fillAddress(page, address);
  await action(form, 'Save').click();
  const record = addressRecord(page, address.alias);
  await expect(record).toHaveCount(1);
  await expect(record).toBeVisible();
  for (const value of Object.values(address)) await expect(record).toContainText(value);
  for (const command of ['Update', 'Delete']) await expect(action(record, command)).toBeVisible();
});
