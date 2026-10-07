// requirement: REQ-5.5
import { test, expect } from "@playwright/test";
import { region, record, records, visible, textVisible, openHome, installClock, isolatedName, openCommon, createAddress } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.5: Save recipient delivery address', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'address_create', 'Addresses');
  const name = isolatedName('Wang Wu', testInfo);
  await createAddress(page, name);
  await expect(records(region(page, 'Address list'))).toHaveCount(1);
  for (const value of ['Shanghai', 'Pudong New Area', 'No. 100 Century Avenue']) await textVisible(record(region(page, 'Address list'), name), value);
  await page.reload();
  await visible(record(region(page, 'Address list'), name));
});

