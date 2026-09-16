import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.2
// fixtures: accounts.addressCreate, address.empty

test('REQ-8.4.2: Add New Address', async ({ page }) => {
  await h.openAddressBook(page, h.FIXTURES.accounts.addressCreate);
  await page.getByRole('button', { name: /^Create new address$/i }).click();
  await page.getByLabel('Alias *', { exact: true }).fill('Office');
  await page.getByLabel('First name *', { exact: true }).fill('Store');
  await page.getByLabel('Last name *', { exact: true }).fill('User');
  await page.getByLabel('Address *', { exact: true }).fill('1 Commerce Road');
  await page.getByLabel('Zip / Postal code *', { exact: true }).fill('200000');
  await page.getByLabel('City *', { exact: true }).fill('Shanghai');
  await page.getByLabel('Country *', { exact: true }).selectOption({ label: 'China' });
  await page.getByLabel('Phone *', { exact: true }).fill('13800000020');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByRole('heading', { name: /^Office$/i })).toBeVisible();
});
