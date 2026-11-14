// requirement: REQ-7.7
import { expect } from "@playwright/test";
import { test, setChecked, expectDateField, expectFieldValue, tripDate, field, button, action, region, radio, record, records, visible, textVisible, openHome, openStatus, registerAccount } from "./helpers";

test('REQ-7.7: Record and reuse a flight-status route query', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openStatus(page);
  await setChecked(radio(page, 'Route'));
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await field(page, 'Departure date').fill(tripDate(page, 2));
  await button(page, 'Search').click();
  await visible(record(region(page, 'Flight status results'), 'MU5234'));
  await openStatus(page);
  await action(region(page, 'Search history'), 'Shanghai - Beijing').click();
  await expect(records(region(page, 'Flight status results'))).toHaveCount(1);
  await textVisible(record(region(page, 'Flight status results'), 'MU5234'), 'Shanghai');
  await textVisible(record(region(page, 'Flight status results'), 'MU5234'), 'Beijing');
  await expectFieldValue(field(page, 'Origin'), 'Shanghai');
  await expectFieldValue(field(page, 'Destination'), 'Beijing');
  await expectDateField(field(page, 'Departure date'), tripDate(page, 2));
});
