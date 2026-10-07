// requirement: REQ-5.15
import { test, expect } from "@playwright/test";
import { button, region, record, heading, textVisible, openHome, installClock, isolatedName, openCommon, createAddress } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.15: Inspect a saved mailing address detail', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'address_detail', 'Addresses');
  const name = isolatedName('Address Detail Reader', testInfo);
  await createAddress(page, name);
  await button(record(region(page, 'Address list'), name), 'View address').click();
  await heading(page, 'Address details');
  for (const value of [name, 'Shanghai', 'Pudong New Area', 'No. 100 Century Avenue', '13800000027']) await textVisible(region(page, 'Address details'), value);
});
