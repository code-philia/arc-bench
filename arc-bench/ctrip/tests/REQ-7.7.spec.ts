// requirement: REQ-7.7
import { expect } from "@playwright/test";
import { test, setChecked, dateControl, expectDateField, expectFieldValue, tripDate, field, button, action, region, radio, records, textVisible, textToken, openHome, openStatus, reopenStatus, statusFlightRecord, setStatusDate, registerAccount } from "./helpers";

test('REQ-7.7: Record and reuse a flight-status route query', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openStatus(page);
  await setChecked(radio(page, 'Route'));
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await setStatusDate(page, tripDate(page, 2));
  await button(page, 'Search').click();
  await statusFlightRecord(page, 'MU5234');
  await reopenStatus(page);
  await action(region(page, 'Search history'), 'Shanghai - Beijing').click();
  await expect(records(region(page, 'Flight status results'))).toHaveCount(1);
  const row = await statusFlightRecord(page, 'MU5234');
  await textVisible(row, textToken('Shanghai'));
  await textVisible(row, textToken('Beijing'));
  await expectFieldValue(field(page, 'Origin'), 'Shanghai');
  await expectFieldValue(field(page, 'Destination'), 'Beijing');
  await expectDateField(dateControl(page, 'Departure date'), tripDate(page, 2));
});
