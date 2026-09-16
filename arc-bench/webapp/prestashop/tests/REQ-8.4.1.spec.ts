import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.1
// fixtures: accounts.addressView, address.home

test('REQ-8.4.1: View Address List', async ({ page }) => {
  await h.openAddressBook(page, h.FIXTURES.accounts.addressView);
  await expect(page.getByRole('heading', { name: /^Addresses$/i }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Home$/i })).toBeVisible();
});
