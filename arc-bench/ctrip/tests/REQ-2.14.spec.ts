// requirement: REQ-2.14
import { test, expect } from "@playwright/test";
import { field, button, region, flight, visible, heading, openHome, installClock, chooseDate, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.14: Recover from an empty flight search', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page, 'Beihai', 'Mars City', '2026-07-23');
  await button(region(page, 'Flight list'), 'Modify search').click();
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Guangzhou');
  await chooseDate(page, 'Departure date', '2026-07-21');
  const search = button(page, 'Search flights').filter({ visible: true }).or(button(page, 'Update results').filter({ visible: true }));
  await search.click();
  await heading(page, 'Flight results');
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  for (const number of ['CZ3401', 'JD5162', 'MU5234']) await visible(flight(page, number));
});
