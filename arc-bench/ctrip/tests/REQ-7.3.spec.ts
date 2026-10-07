// requirement: REQ-7.3
import { test, expect } from "@playwright/test";
import { field, button, region, radio, record, records, flight, textVisible, openHome, installClock, openStatus } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.3: Show matching route flight statuses', async ({ page }, testInfo) => {
  await openHome(page);
  await openStatus(page);
  await radio(page, 'Route').check();
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await field(page, 'Departure date').fill('2026-07-21');
  await button(page, 'Search').click();
  await expect(records(region(page, 'Flight status results'))).toHaveCount(1);
  for (const value of ['Shanghai', 'Beijing', 'China Eastern', '09:00', '11:30', 'Scheduled']) await textVisible(record(region(page, 'Flight status results'), 'MU5234'), value);
});

test('REQ-7.3: Exchange status route without running query', async ({ page }, testInfo) => {
  await openHome(page);
  await openStatus(page);
  await radio(page, 'Route').check();
  await field(page, 'Origin').fill('Shanghai');
  await field(page, 'Destination').fill('Beijing');
  await button(page, 'Swap cities').click();
  await expect(field(page, 'Origin')).toHaveValue('Beijing');
  await expect(field(page, 'Destination')).toHaveValue('Shanghai');
  await expect(region(page, 'Flight status results')).not.toBeVisible();
});

