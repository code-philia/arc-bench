// requirement: REQ-5.16
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, textVisible, openHome, installClock, isolatedName, openCommon, createTraveler, IDS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.16: Find a traveler created in the current session', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_search_created', 'Travelers');
  const name = isolatedName('Search New Traveler', testInfo);
  await createTraveler(page, name, IDS[0]);
  await field(page, 'Traveler name').fill(name);
  await button(page, 'Search travelers').click();
  await expect(records(region(page, 'Traveler list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Traveler list'), name), '110101********1237');
});
