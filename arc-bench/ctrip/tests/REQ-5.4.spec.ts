// requirement: REQ-5.4
import { test, expect } from "@playwright/test";
import { region, record, records, textVisible, openHome, installClock, openCommon } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.4: Read recipient and delivery location', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'personal_read', 'Addresses');
  await expect(records(region(page, 'Address list'))).toHaveCount(1);
  for (const value of ['Shanghai', 'Pudong New Area', 'No. 100 Century Avenue']) await textVisible(record(region(page, 'Address list'), 'Zhang San'), value);
});

