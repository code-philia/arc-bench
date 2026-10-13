// requirement: REQ-5.4.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-5.4.1: Open upcoming-trip filters", async ({ page }) => {
  await entry(page);
  await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
  await orders(page, 'Upcoming trips');
  for (const name of ['Order date type', 'Start date', 'End date']) await expect(field(page, name)).toBeVisible();
  await expect(button(page, 'Search')).toBeVisible();
});
