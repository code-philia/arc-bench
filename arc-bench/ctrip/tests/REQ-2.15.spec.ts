// requirement: REQ-2.15
import { test, expect } from "@playwright/test";
import { field, region, checkbox, flight, visible, openHome, installClock, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.15: Restore flights after removing nonstop filter', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await checkbox(page, 'Nonstop only').check();
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(2);
  await checkbox(page, 'Nonstop only').uncheck();
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  for (const number of ['CZ3401', 'JD5162', 'MU5234']) await visible(flight(page, number));
  await expect(field(page, 'Origin')).toHaveValue('Chengdu');
  await expect(field(page, 'Destination')).toHaveValue('Guangzhou');
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-21');
});
