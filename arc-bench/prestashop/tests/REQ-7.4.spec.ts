// requirement: REQ-7.4
import { test, expect } from '@playwright/test';
import { home, action, loginExisting, createAddress, confirmDeletion, addressRecord, field, inputForm } from './helpers';
import { addressInput, replacementStreet } from './fixtures/data';

test("REQ-7.4: Update Home street", async ({ page }) => {
  await home(page);
  const customer = await loginExisting(page, 'address_edit_user');
  const address = addressInput(customer);
  await createAddress(page, address);
  const record = addressRecord(page, address.alias);
  await action(record, 'Update').click();
  const form = inputForm(page, ['Alias', 'Address'], 'Save');
  await expect(field(form, 'Alias')).toHaveValue(address.alias);
  await expect(field(form, 'Address')).toHaveValue(address.Address);
  const replacement = replacementStreet();
  await field(form, 'Address').fill(replacement);
  await action(form, 'Save').click();
  await expect(record).toHaveCount(1);
  await expect(record).toContainText(replacement);
  await expect(record).not.toContainText(address.Address);
});

test("REQ-7.4: Delete Home address", async ({ page }) => {
  await home(page);
  const customer = await loginExisting(page, 'address_delete_user');
  const address = addressInput(customer);
  await createAddress(page, address);
  const record = addressRecord(page, address.alias);
  await expect(record).toBeVisible();
  await confirmDeletion(page, action(record, 'Delete'));
  await expect(record).toHaveCount(0);
  await expect(action(page, 'Create new address')).toBeVisible();
});
