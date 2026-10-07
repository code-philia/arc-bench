// requirement: REQ-5.10
import { test, expect } from "@playwright/test";
import { button, region, dialog, checkbox, record, records, visible, openHome, installClock, isolatedName, openCommon, createTraveler, IDS } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.10: Delete one traveler after confirmation', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_delete', 'Travelers');
  const target = isolatedName('Traveler Delete A', testInfo);
  const keep = isolatedName('Traveler Keep A', testInfo);
  await createTraveler(page, target, IDS[0]);
  await createTraveler(page, keep, IDS[1]);
  await visible(record(region(page, 'Traveler list'), target));
  await button(record(region(page, 'Traveler list'), target), 'Delete').click();
  await visible(dialog(page, 'Delete traveler'));
  await visible(record(region(page, 'Traveler list'), target));
  await button(dialog(page, 'Delete traveler'), 'Confirm deletion').click();
  await expect(record(region(page, 'Traveler list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep));
  await page.reload();
  await expect(record(region(page, 'Traveler list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep));
});

test('REQ-5.10: Delete only selected traveler records', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'traveler_batch', 'Travelers');
  const a = isolatedName('Traveler Batch A', testInfo);
  const b = isolatedName('Traveler Batch B', testInfo);
  const keep = isolatedName('Traveler Keep', testInfo);
  await createTraveler(page, a, IDS[0]);
  await createTraveler(page, b, IDS[1]);
  await createTraveler(page, keep, IDS[2]);
  await checkbox(region(page, 'Traveler list'), a).check();
  await checkbox(region(page, 'Traveler list'), b).check();
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete travelers'), 'Confirm deletion').click();
  await expect(record(region(page, 'Traveler list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Traveler list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep));
  await page.reload();
  await expect(record(region(page, 'Traveler list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Traveler list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep));
});

