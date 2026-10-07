// requirement: REQ-7.6
import { test, expect } from "@playwright/test";
import { field, region, radio, visible, openHome, installClock, openStatus } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.6: Switch flight-status query dimensions', async ({ page }, testInfo) => {
  await openHome(page);
  await openStatus(page);
  await radio(page, 'Route').check();
  await expect(radio(page, 'Route')).toBeChecked();
  await visible(field(page, 'Origin'));
  await visible(field(page, 'Destination'));
  await visible(field(page, 'Departure date'));
  await expect(page.getByRole('textbox', { name: 'Flight number', exact: true })).not.toBeVisible();
  await radio(page, 'Flight number').check();
  await expect(radio(page, 'Flight number')).toBeChecked();
  await visible(page.getByRole('textbox', { name: 'Flight number', exact: true }));
  await visible(field(page, 'Departure date'));
  await expect(field(page, 'Origin')).not.toBeVisible();
  await expect(field(page, 'Destination')).not.toBeVisible();
  await expect(region(page, 'Flight status results')).not.toBeVisible();
  await expect(region(page, 'Flight details')).not.toBeVisible();
});
