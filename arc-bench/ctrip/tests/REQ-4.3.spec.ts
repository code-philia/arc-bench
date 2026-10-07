// requirement: REQ-4.3
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, textVisible, openHome, installClock, openOrders } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.3: Find exact order number', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await field(page, 'Order number').fill('CTRIP20260721001');
  await button(page, 'Search orders').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Order list'), 'CTRIP20260721001'), 'JD5162');
  await expect(record(region(page, 'Order list'), 'CTRIP20260722002')).toHaveCount(0);
  await expect(record(region(page, 'Order list'), 'CTRIP20260718003')).toHaveCount(0);
});

