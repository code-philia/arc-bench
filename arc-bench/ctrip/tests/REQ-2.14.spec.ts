// requirement: REQ-2.14
import { expect } from "@playwright/test";
import { test, tripDate, field, button, region, flight, visible, heading, openHome, chooseDate, searchFlights, flightRows } from "./helpers";

test('REQ-2.14: Recover from an empty flight search', async ({ page }) => {
  await openHome(page);
  await searchFlights(page, 'Beihai', 'Mars City', tripDate(page, 4));
  await button(region(page, 'Flight list'), 'Modify search').click();
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Guangzhou');
  await chooseDate(page, 'Departure date', tripDate(page, 2));
  const search = button(page, 'Search flights').filter({ visible: true }).or(button(page, 'Update results').filter({ visible: true }));
  await search.click();
  await heading(page, 'Flight results');
  await expect(flightRows(page)).toHaveCount(3);
  for (const number of ['CZ3401', 'JD5162', 'MU5234']) await visible(flight(page, number));
});
