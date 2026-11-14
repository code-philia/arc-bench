// requirement: REQ-7.3
import { expect } from "@playwright/test";
import { test, setChecked, expectFieldValue, tripDate, field, button, region, radio, record, records, textVisible, openHome, openStatus } from "./helpers";

test('REQ-7.3: Show matching route flight statuses', async ({ page }) => {
  await openHome(page);
  await openStatus(page);
  await setChecked(radio(page, 'Route'));
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await field(page, 'Departure date').fill(tripDate(page, 2));
  await button(page, 'Search').click();
  await expect(records(region(page, 'Flight status results'))).toHaveCount(1);
  for (const value of ['Shanghai', 'Beijing', 'China Eastern', '09:00', '11:30', 'Scheduled']) await textVisible(record(region(page, 'Flight status results'), 'MU5234'), value);
});

test('REQ-7.3: Exchange status route without running query', async ({ page }) => {
  await openHome(page);
  await openStatus(page);
  await setChecked(radio(page, 'Route'));
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await button(page, 'Swap cities').click();
  await expectFieldValue(field(page, 'Origin'), 'Beijing');
  await expectFieldValue(field(page, 'Destination'), 'Shanghai');
  await expect(region(page, 'Flight status results')).not.toBeVisible();
});
