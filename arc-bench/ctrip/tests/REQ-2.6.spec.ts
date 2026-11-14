// requirement: REQ-2.6
import { test, expectDateField, expectFieldValue, tripDate, field, action, region, heading, openHome, searchFlights } from "./helpers";

test('REQ-2.6: Reuse anonymous route history', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await openHome(page);
  await action(region(page, 'Search history'), 'Chengdu - Guangzhou').click();
  await heading(page, 'Flight results');
  await expectFieldValue(field(page, 'Origin'), 'Chengdu');
  await expectFieldValue(field(page, 'Destination'), 'Guangzhou');
  await expectDateField(field(page, 'Departure date'), tripDate(page, 2));
});
