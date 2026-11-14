// requirement: REQ-7.6
import { expect } from "@playwright/test";
import { test, setChecked, field, region, radio, visible, openHome, openStatus } from "./helpers";

test('REQ-7.6: Switch flight-status query dimensions', async ({ page }) => {
  await openHome(page);
  await openStatus(page);
  await setChecked(radio(page, 'Route'));
  await expect(radio(page, 'Route')).toBeChecked();
  await visible(field(page, 'Origin'));
  await visible(field(page, 'Destination'));
  await visible(field(page, 'Departure date'));
  await expect(field(page, 'Flight number')).not.toBeVisible();
  await setChecked(radio(page, 'Flight number'));
  await expect(radio(page, 'Flight number')).toBeChecked();
  await visible(field(page, 'Flight number'));
  await visible(field(page, 'Departure date'));
  await expect(field(page, 'Origin')).not.toBeVisible();
  await expect(field(page, 'Destination')).not.toBeVisible();
  await expect(region(page, 'Flight status results')).not.toBeVisible();
  await expect(region(page, 'Flight details')).not.toBeVisible();
});
