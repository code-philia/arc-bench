// requirement: REQ-9.3
import { test, expect } from "@playwright/test";
import { region, tab, record, textVisible, openHome, installClock, openAirportDetails } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-9.3: Read default airport overview', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirportDetails(page);
  await expect(tab(page, 'Overview')).toHaveAttribute('aria-selected', 'true');
  await tab(page, 'Overview').click();
  for (const value of ['Beijing', '3 runways', "China's first national gateway"]) await textVisible(region(page, 'Airport overview'), value);
});

test('REQ-9.3: Read airport bus timetable', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirportDetails(page);
  await tab(page, 'Transportation').click();
  for (const value of ['Fangzhuang', '06:00', '21:00', '30 minutes']) await textVisible(record(region(page, 'City buses'), 'Fangzhuang line'), value);
});

test('REQ-9.3: Read airport medical hotline', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirportDetails(page);
  await tab(page, 'Phone numbers').click();
  await textVisible(record(page, 'Medical first aid center'), '010-64541100');
});

