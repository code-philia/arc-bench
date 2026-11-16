// requirement: REQ-2.3
import { expect } from "@playwright/test";
import { test, expectDateField, tripDate, dateControl, openCalendar, button, radio, visible, textVisible, openHome, chooseDate, dayAction } from "./helpers";

test('REQ-2.3: Select a future departure with fare', async ({ page }) => {
  await openHome(page);
  const calendar = await openCalendar(page, 'Departure date');
  await expect(dayAction(calendar, tripDate(page, 2))).toContainText('¥460');
  await dayAction(calendar, tripDate(page, 2)).click();
  await expectDateField(dateControl(page, 'Departure date'), tripDate(page, 2));
  await expect(dayAction(calendar, tripDate(page, 2))).not.toBeVisible();
});

test('REQ-2.3: Disable past departure dates', async ({ page }) => {
  await openHome(page);
  const calendar = await openCalendar(page, 'Departure date');
  await visible(dayAction(calendar, tripDate(page, -1)));
  await expect(dayAction(calendar, tripDate(page, -1))).toBeDisabled();
});

test('REQ-2.3: Add a four-day return trip', async ({ page }) => {
  await openHome(page);
  await chooseDate(page, 'Departure date', tripDate(page, 2));
  await button(page, 'Add return').click();
  await expect(radio(page, 'Round trip')).toBeChecked();
  await dayAction(page, tripDate(page, 6)).click();
  await expectDateField(dateControl(page, 'Return date'), tripDate(page, 6));
  await textVisible(page, '4 days');
});

test('REQ-2.3: Disable return before departure', async ({ page }) => {
  await openHome(page);
  await chooseDate(page, 'Departure date', tripDate(page, 2));
  await button(page, 'Add return').click();
  await visible(dayAction(page, tripDate(page, 1)));
  await expect(dayAction(page, tripDate(page, 1))).toBeDisabled();
});
