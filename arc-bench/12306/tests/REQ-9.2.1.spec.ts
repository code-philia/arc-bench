// requirement: REQ-9.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-9.2.1: Open travel-guide dropdown", async ({ page }) => {
  await entry(page);
  await link(page.getByRole('navigation'), 'Travel guide').hover();
  const dropdown = region(page, 'Travel guide categories');
  await expect(dropdown).toBeVisible();
  for (const name of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) await expect(link(region(dropdown, name), 'More')).toBeVisible();
});
