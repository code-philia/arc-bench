// requirement: REQ-5.2
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, visible, textVisible, openHome, installClock, openCommon } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.2: Find matching traveler', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'personal_read', 'Travelers');
  await field(page, 'Traveler name').fill('Li Si');
  await button(page, 'Search travelers').click();
  await expect(records(region(page, 'Traveler list'))).toHaveCount(1);
  await visible(record(region(page, 'Traveler list'), 'Li Si'));
});

test('REQ-5.2: Show traveler search empty state', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'personal_read', 'Travelers');
  await field(page, 'Traveler name').fill('Nobody Example');
  await button(page, 'Search travelers').click();
  await expect(records(region(page, 'Traveler list'))).toHaveCount(0);
  await textVisible(region(page, 'Traveler list'), 'No travelers found');
});

