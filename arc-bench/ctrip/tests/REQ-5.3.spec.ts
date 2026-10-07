// requirement: REQ-5.3
import { test, expect } from "@playwright/test";
import { button, region, record, records, visible, textVisible, alertText, openHome, installClock, isolatedName, openCommon, createTraveler, IDS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.3: Save traveler and retain masked identity', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_create', 'Travelers');
  const name = isolatedName('Wang Wu', testInfo);
  await createTraveler(page, name, IDS[0]);
  await expect(records(region(page, 'Traveler list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Traveler list'), name), '110101********1237');
  await page.reload();
  await textVisible(record(region(page, 'Traveler list'), name), '110101********1237');
});

test('REQ-5.3: Reject traveler without full name', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_create', 'Travelers');
  const before = await records(region(page, 'Traveler list')).count();
  await button(page, 'Add traveler').click();
  await button(region(page, 'Add traveler'), 'Save traveler').click();
  await alertText(region(page, 'Add traveler'), 'Enter a full name');
  await visible(region(page, 'Add traveler'));
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
});

