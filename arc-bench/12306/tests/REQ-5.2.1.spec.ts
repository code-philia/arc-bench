// requirement: REQ-5.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, entry, orders, tab } from './helpers';

test("REQ-5.2.1: Open ticket-order categories", async ({ page }) => {
  await entry(page);
  await createAccount(page);
  await orders(page, 'Uncompleted orders');
  for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders']) await expect(tab(page, name)).toBeVisible();
});
