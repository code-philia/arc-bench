// requirement: REQ-4.2
import { test, expect } from "@playwright/test";
import { button, region, tab, record, records, visible, textVisible, openHome, installClock, openOrders } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.2: Filter pending payment', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'Pending payment').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Order list'), 'CTRIP20260721001'), 'Pending payment');
  await expect(record(region(page, 'Order list'), 'CTRIP20260722002')).toHaveCount(0);
  await expect(record(region(page, 'Order list'), 'CTRIP20260718003')).toHaveCount(0);
  await visible(button(record(region(page, 'Order list'), 'CTRIP20260721001'), 'Pay now'));
});

test('REQ-4.2: Filter not traveled', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'Not traveled').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Order list'), 'CTRIP20260722002'), 'Not traveled');
  await expect(record(region(page, 'Order list'), 'CTRIP20260721001')).toHaveCount(0);
  await expect(record(region(page, 'Order list'), 'CTRIP20260718003')).toHaveCount(0);
});

test('REQ-4.2: Filter pending review', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'Pending review').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Order list'), 'CTRIP20260718003'), 'Pending review');
  await expect(record(region(page, 'Order list'), 'CTRIP20260721001')).toHaveCount(0);
  await expect(record(region(page, 'Order list'), 'CTRIP20260722002')).toHaveCount(0);
});

test('REQ-4.2: Show all account orders', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrders(page, 'order_read');
  await tab(page, 'All orders').click();
  await expect(records(region(page, 'Order list'))).toHaveCount(3);
  for (const [id, flightNo, totalText] of [['CTRIP20260721001', 'JD5162', '¥530'], ['CTRIP20260722002', 'CZ3401', '¥390'], ['CTRIP20260718003', 'MU5234', '¥650']]) {
   await textVisible(record(region(page, 'Order list'), id), flightNo);
   await textVisible(record(region(page, 'Order list'), id), totalText);
   const status = id === 'CTRIP20260721001' ? 'Pending payment' : id === 'CTRIP20260722002' ? 'Not traveled' : 'Pending review';
  }
});

