// requirement: REQ-2.4
import { test, expect } from "@playwright/test";
import { field, button, region, flight, visible, heading, textVisible, alertText, openHome, installClock, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.4: Show matching published flights', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await heading(page, 'Flight results');
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  for (const n of ['CZ3401', 'JD5162', 'MU5234']) await visible(flight(page, n));
  await expect(field(page, 'Origin')).toHaveValue('Chengdu');
  await expect(field(page, 'Destination')).toHaveValue('Guangzhou');
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-21');
});

test('REQ-2.4: Reject identical cities', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Chengdu');
  await button(page, 'Search flights').click();
  await alertText(page, 'Origin and destination cannot be the same');
  await visible(field(page, 'Origin'));
  await visible(button(page, 'Search flights'));
  await expect(page.getByRole('heading', { name: 'Flight results', exact: true })).toHaveCount(0);
});

test('REQ-2.4: Show empty route result', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page, 'Beihai', 'Mars City', '2026-07-23');
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(0);
  await textVisible(region(page, 'Flight list'), 'No flights found');
  await visible(button(region(page, 'Flight list'), 'Modify search'));
});

