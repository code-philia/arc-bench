// requirement: REQ-2.8
import { expect } from "@playwright/test";
import { test, expectDateField, tripDate, field, button, region, dialog, flight, visible, textVisible, openHome, searchFlights, dayAction, flightRows } from "./helpers";

test('REQ-2.8: Switch to nearby low-fare date', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await expect(dayAction(region(page, 'Date bar'), tripDate(page, 3))).toContainText('¥320');
  await dayAction(region(page, 'Date bar'), tripDate(page, 3)).click();
  await expectDateField(field(page, 'Departure date'), tripDate(page, 3));
  await expect(flightRows(page)).toHaveCount(1);
  await textVisible(flight(page, 'CZ3401'), '¥320');
});

test('REQ-2.8: Open monthly fares', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await button(region(page, 'Date bar'), 'More dates').click();
  await visible(dialog(page, 'Monthly fares'));
  await expect(dayAction(dialog(page, 'Monthly fares'), tripDate(page, 3))).toContainText('¥320');
});

test('REQ-2.8: View next week dates', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await button(region(page, 'Date bar'), 'Next week').click();
  await visible(dayAction(region(page, 'Date bar'), tripDate(page, 9)));
});
