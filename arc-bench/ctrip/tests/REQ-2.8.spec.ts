// requirement: REQ-2.8
import { test, expect } from "@playwright/test";
import { field, button, region, dialog, flight, visible, textVisible, openHome, installClock, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.8: Switch to nearby low-fare date', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await expect(button(region(page, 'Date bar'), '2026-07-22')).toContainText('¥320');
  await button(region(page, 'Date bar'), '2026-07-22').click();
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-22');
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(1);
  await textVisible(flight(page, 'CZ3401'), '¥320');
});

test('REQ-2.8: Open monthly fares', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await button(region(page, 'Date bar'), 'More dates').click();
  await visible(dialog(page, 'Monthly fares'));
  await expect(button(dialog(page, 'Monthly fares'), '2026-07-22')).toContainText('¥320');
});

test('REQ-2.8: View next week dates', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await button(region(page, 'Date bar'), 'Next week').click();
  await visible(button(region(page, 'Date bar'), '2026-07-28'));
});

