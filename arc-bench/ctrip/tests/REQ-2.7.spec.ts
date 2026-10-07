// requirement: REQ-2.7
import { test, expect } from "@playwright/test";
import { field, button, region, flight, heading, textVisible, openHome, installClock, chooseDate, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.7: Refresh date and cabin on results', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await chooseDate(page, 'Departure date', '2026-07-22');
  await field(page, 'Cabin class').selectOption({ label: 'Economy' });
  await button(page, 'Update results').click();
  await heading(page, 'Flight results');
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-22');
  await expect(field(page, 'Cabin class').getByRole('option', { name: 'Economy', exact: true })).toHaveJSProperty('selected', true);
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(1);
  await textVisible(flight(page, 'CZ3401'), '¥320');
});

