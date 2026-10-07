// requirement: REQ-5.19
import { test, expect } from "@playwright/test";
import { button, region, dialog, record, records, textVisible, openHome, installClock, isolatedName, openCommon, createTraveler, IDS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.19: Keep a traveler when deletion is declined', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_decline', 'Travelers');
  const name = isolatedName('Keep Declined Traveler', testInfo);
  await createTraveler(page, name, IDS[0]);
  const before = await records(region(page, 'Traveler list')).count();
  await button(record(region(page, 'Traveler list'), name), 'Delete').click();
  await button(dialog(page, 'Delete traveler'), 'Keep traveler').click();
  await expect(dialog(page, 'Delete traveler')).toHaveCount(0);
  await textVisible(record(region(page, 'Traveler list'), name), '110101********1237');
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
  await page.reload();
  await textVisible(record(region(page, 'Traveler list'), name), '110101********1237');
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
});
