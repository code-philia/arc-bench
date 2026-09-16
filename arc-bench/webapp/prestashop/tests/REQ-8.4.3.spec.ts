import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.3
// fixtures: accounts.addressEdit, address.home

test('REQ-8.4.3: Edit Address', async ({ page }) => {
  await h.openAddressBook(page, h.FIXTURES.accounts.addressEdit);
  await page.getByRole('button', { name: /^Update$/i }).click();
  await expect(page.getByRole('heading', { name: /^Update address$/i })).toBeVisible();
  await page.getByLabel('Address *', { exact: true }).fill('88 Market Street');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByText(/^Address updated successfully\.$/i)).toBeVisible();
});
