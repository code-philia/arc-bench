// requirement: REQ-7.7
import { test, expect } from "@playwright/test";
import { field, button, action, region, radio, record, records, visible, textVisible, openHome, installClock, loginOwner, openStatus } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.7: Record and reuse a flight-status route query', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'status_route_history');
  await openStatus(page);
  await radio(page, 'Route').check();
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await field(page, 'Departure date').fill('2026-07-21');
  await button(page, 'Search').click();
  await visible(record(region(page, 'Flight status results'), 'MU5234'));
  await openStatus(page);
  await action(region(page, 'Search history'), 'Shanghai - Beijing').click();
  await expect(records(region(page, 'Flight status results'))).toHaveCount(1);
  await textVisible(record(region(page, 'Flight status results'), 'MU5234'), 'Shanghai');
  await textVisible(record(region(page, 'Flight status results'), 'MU5234'), 'Beijing');
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-21');
});
