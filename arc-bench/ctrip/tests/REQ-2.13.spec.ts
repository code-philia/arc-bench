// requirement: REQ-2.13
import { test, dateControl, expectDateField, expectFieldValue, tripDate, field, button, expectEmptyFlights, heading, openHome, chooseDate, searchFlights } from "./helpers";

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
  await expectDateField(dateControl(page, 'Departure date'), tripDate(page, 4));
  await expectEmptyFlights(page);
});
