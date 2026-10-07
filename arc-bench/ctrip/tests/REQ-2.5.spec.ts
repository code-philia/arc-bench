// requirement: REQ-2.5
import { test, expect } from "@playwright/test";
import { field, checkbox, heading, textVisible, openHome, installClock, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.5: Search with children included', async ({ page }, testInfo) => {
  await openHome(page);
  await checkbox(page, 'Traveling with children').check();
  await searchFlights(page);
  await heading(page, 'Flight results');
  await textVisible(page, 'Children included');
});

test('REQ-2.5: Choose Economy preference', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Cabin class').selectOption({ label: 'Economy' });
  await searchFlights(page);
  await expect(field(page, 'Cabin class').getByRole('option', { name: 'Economy', exact: true })).toHaveJSProperty('selected', true);
});

