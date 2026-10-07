// requirement: REQ-5.8
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, textVisible, openHome, installClock, openCommon } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.8: Find company title by keyword', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_search', 'Invoice titles');
  await field(page, 'Search invoice titles').fill('Shanghai Example');
  await button(page, 'Search').click();
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Invoice title list'), 'Shanghai Example Technology Co., Ltd.'), '91310000123456789A');
});

