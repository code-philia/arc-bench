// requirement: REQ-2.15
import { expect } from "@playwright/test";
import { test, setChecked, expectDateField, expectFieldValue, tripDate, field, checkbox, flight, visible, openHome, searchFlights, flightRows } from "./helpers";

test('REQ-2.15: Restore flights after removing nonstop filter', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await setChecked(checkbox(page, 'Nonstop only'));
  await expect(flightRows(page)).toHaveCount(2);
  await setChecked(checkbox(page, 'Nonstop only'), false);
  await expect(flightRows(page)).toHaveCount(3);
  for (const number of ['CZ3401', 'JD5162', 'MU5234']) await visible(flight(page, number));
  await expectFieldValue(field(page, 'Origin'), 'Chengdu');
  await expectFieldValue(field(page, 'Destination'), 'Guangzhou');
  await expectDateField(field(page, 'Departure date'), tripDate(page, 2));
});
