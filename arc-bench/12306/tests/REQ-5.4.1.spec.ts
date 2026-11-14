// requirement: REQ-5.4.1
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, entry, field, orderSetup, orders } from './helpers';
import { bookingAccounts } from './fixtures/data';

test("REQ-5.4.1: Open upcoming-trip filters", async ({ page }) => {
  await entry(page);
  await orderSetup(page, bookingAccounts.upcoming, travelDate(page, 1), true);
  await orders(page, 'Upcoming trips');
  for (const name of ['Order date type', 'Start date', 'End date']) await expect(field(page, name)).toBeVisible();
  await expect(button(page, 'Search')).toBeVisible();
});
