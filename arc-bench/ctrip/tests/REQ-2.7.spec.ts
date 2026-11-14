// requirement: REQ-2.7
import { expect } from "@playwright/test";
import { test, expectDateField, tripDate, field, button, flight, heading, textVisible, openHome, chooseDate, searchFlights, expectChoice, flightRows, selectChoice } from "./helpers";

test('REQ-2.7: Refresh date and cabin on results', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await chooseDate(page, 'Departure date', tripDate(page, 3));
  await selectChoice(page, 'Cabin class', 'Economy');
  await button(page, 'Update results').click();
  await heading(page, 'Flight results');
  await expectDateField(field(page, 'Departure date'), tripDate(page, 3));
  await expectChoice(page, 'Cabin class', 'Economy');
  await expect(flightRows(page)).toHaveCount(1);
  await textVisible(flight(page, 'CZ3401'), '¥320');
});
