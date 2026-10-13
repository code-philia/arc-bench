// requirement: REQ-5.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-5.2.1: Open ticket-order categories", async ({ page }) => {
  await entry(page);
  await login(page, 'orders_empty_user');
  await orders(page, 'Uncompleted orders');
  for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders']) await expect(page.getByRole('tab', { name, exact: true })).toBeVisible();
});
