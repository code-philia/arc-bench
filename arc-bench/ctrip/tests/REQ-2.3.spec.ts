// requirement: REQ-2.3
import { test, expect } from "@playwright/test";
import { field, button, radio, visible, textVisible, openHome, installClock, chooseDate } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.3: Select a future departure with fare', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Departure date').click();
  await textVisible(page, '¥460');
  await button(page, '2026-07-21').click();
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-21');
  await expect(button(page, '2026-07-21')).not.toBeVisible();
});

test('REQ-2.3: Disable past departure dates', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Departure date').click();
  await visible(button(page, '2026-07-18'));
  await expect(button(page, '2026-07-18')).toBeDisabled();
});

test('REQ-2.3: Add a four-day return trip', async ({ page }, testInfo) => {
  await openHome(page);
  await chooseDate(page, 'Departure date', '2026-07-21');
  await button(page, 'Add return').click();
  await expect(radio(page, 'Round trip')).toBeChecked();
  await button(page, '2026-07-25').click();
  await expect(field(page, 'Return date')).toHaveValue('2026-07-25');
  await textVisible(page, '4 days');
});

test('REQ-2.3: Disable return before departure', async ({ page }, testInfo) => {
  await openHome(page);
  await chooseDate(page, 'Departure date', '2026-07-21');
  await button(page, 'Add return').click();
  await visible(button(page, '2026-07-20'));
  await expect(button(page, '2026-07-20')).toBeDisabled();
});

