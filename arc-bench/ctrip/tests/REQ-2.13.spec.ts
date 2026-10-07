// requirement: REQ-2.13
import { test, expect } from "@playwright/test";
import { field, button, region, visible, heading, textVisible, openHome, installClock, chooseDate, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.13: Change route criteria on flight results', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await field(page, 'Origin').fill('Beihai');
  await field(page, 'Destination').fill('Mars City');
  await chooseDate(page, 'Departure date', '2026-07-23');
  await button(page, 'Update results').click();
  await heading(page, 'Flight results');
  await expect(field(page, 'Origin')).toHaveValue('Beihai');
  await expect(field(page, 'Destination')).toHaveValue('Mars City');
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-23');
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(0);
  await textVisible(region(page, 'Flight list'), 'No flights found');
  await visible(button(region(page, 'Flight list'), 'Modify search'));
});
