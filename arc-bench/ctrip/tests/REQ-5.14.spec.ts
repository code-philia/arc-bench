// requirement: REQ-5.14
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, textVisible, openHome, installClock, isolatedName, openCommon, createTraveler, IDS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.14: Edit a saved traveler name', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_edit', 'Travelers');
  const original = isolatedName('Original Traveler', testInfo);
  const updated = isolatedName('Updated Traveler', testInfo);
  await createTraveler(page, original, IDS[0]);
  const before = await records(region(page, 'Traveler list')).count();
  await button(record(region(page, 'Traveler list'), original), 'Edit').click();
  await expect(field(region(page, 'Edit traveler'), 'ID number')).toHaveValue(IDS[0]);
  await field(region(page, 'Edit traveler'), 'Full name').fill(updated);
  await button(region(page, 'Edit traveler'), 'Save traveler').click();
  await expect(record(region(page, 'Traveler list'), original)).toHaveCount(0);
  await textVisible(record(region(page, 'Traveler list'), updated), '110101********1237');
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
  await page.reload();
  await expect(record(region(page, 'Traveler list'), original)).toHaveCount(0);
  await textVisible(record(region(page, 'Traveler list'), updated), '110101********1237');
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
});
