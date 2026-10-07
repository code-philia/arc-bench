// requirement: REQ-4.7
import { test, expect } from "@playwright/test";
import { region, tab, record, records, openHome, installClock, openOrders } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.7: Keep order lists scoped to the current account', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrders(page, 'profile_read');
  await tab(page, 'All orders').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(0);
  for (const number of ['CTRIP20260721001', 'CTRIP20260722002', 'CTRIP20260718003', 'CTRIP20260721004']) await expect(record(region(page, 'Order list'), number)).toHaveCount(0);
});
