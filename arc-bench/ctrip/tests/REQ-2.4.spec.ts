// requirement: REQ-2.4
import { expect } from "@playwright/test";
import { CHENGDU_GUANGZHOU_FLIGHTS } from "./fixtures/data";
import { test, expectDateField, expectFieldValue, tripDate, field, button, region, flight, visible, heading, textVisible, alertText, openHome, searchFlights, flightRows } from "./helpers";

test('REQ-2.4: Show matching published flights', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await heading(page, 'Flight results');
  await expect(flightRows(page)).toHaveCount(CHENGDU_GUANGZHOU_FLIGHTS.length);
  for (const entry of CHENGDU_GUANGZHOU_FLIGHTS) {
    const row = flight(page, entry.number);
    await visible(row);
    for (const value of [entry.fare, entry.departure, entry.punctuality]) {
      await textVisible(row, value);
    }
  }
  await expectFieldValue(field(page, 'Origin'), 'Chengdu');
  await expectFieldValue(field(page, 'Destination'), 'Guangzhou');
  await expectDateField(field(page, 'Departure date'), tripDate(page, 2));
});

test('REQ-2.4: Reject identical cities', async ({ page }) => {
  await openHome(page);
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Chengdu');
  await button(page, 'Search flights').click();
  await alertText(page, 'Origin and destination cannot be the same');
  await visible(field(page, 'Origin'));
  await visible(button(page, 'Search flights'));
  await expect(page.getByRole('heading', { name: 'Flight results', exact: true })).toHaveCount(0);
});

test('REQ-2.4: Show empty route result', async ({ page }) => {
  await openHome(page);
  await searchFlights(page, 'Beihai', 'Mars City', tripDate(page, 4));
  await expect(flightRows(page)).toHaveCount(0);
  await textVisible(region(page, 'Flight list'), 'No flights found');
  await visible(button(region(page, 'Flight list'), 'Modify search'));
});
