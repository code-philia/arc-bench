// requirement: REQ-2.13
import { expect } from "@playwright/test";
import { test, expectDateField, expectFieldValue, tripDate, field, button, region, visible, heading, textVisible, openHome, chooseDate, searchFlights, flightRows } from "./helpers";

test('REQ-2.13: Change route criteria on flight results', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await field(page, 'Origin').fill('Beihai');
  await field(page, 'Destination').fill('Mars City');
  await chooseDate(page, 'Departure date', tripDate(page, 4));
  await button(page, 'Update results').click();
  await heading(page, 'Flight results');
  await expectFieldValue(field(page, 'Origin'), 'Beihai');
  await expectFieldValue(field(page, 'Destination'), 'Mars City');
  await expectDateField(field(page, 'Departure date'), tripDate(page, 4));
  await expect(flightRows(page)).toHaveCount(0);
  await textVisible(region(page, 'Flight list'), 'No flights found');
  await visible(button(region(page, 'Flight list'), 'Modify search'));
});
