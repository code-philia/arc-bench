// requirement: REQ-5.18
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, openHome, installClock, isolatedName, openCommon } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.18: Exclude nonmatching invoice titles', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_search', 'Invoice titles');
  await field(page, 'Search invoice titles').fill(isolatedName('Absent Invoice', testInfo));
  await button(page, 'Search').click();
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(0);
  await expect(record(region(page, 'Invoice title list'), 'Shanghai Example Technology Co., Ltd.')).toHaveCount(0);
});
