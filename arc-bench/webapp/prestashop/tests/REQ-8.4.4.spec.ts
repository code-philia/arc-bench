import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.4
// fixtures: accounts.addressDelete, address.home

test('REQ-8.4.4: Delete Address', async ({ page }) => {
  await h.openAddressBook(page, h.FIXTURES.accounts.addressDelete);
  await page.getByRole('button', { name: /^Delete$/i }).click();
  await expect(page.getByText(/^Address deleted\.$/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Home$/i })).toHaveCount(0);
});
