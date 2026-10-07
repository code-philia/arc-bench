// requirement: REQ-8.2
import { test, expect } from "@playwright/test";
import { action, region, tab, record, records, visible, textVisible, openHome, installClock, openVouchers } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-8.2: Show currently eligible pending order', async ({ page }, testInfo) => {
  await openHome(page);
  await openVouchers(page, 'voucher_pending');
  await tab(page, 'Pending').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(1);
  await visible(record(region(page, 'Pending vouchers'), 'CTRIP20260721005'));
});

test('REQ-8.2: Load older eligible order from past year', async ({ page }, testInfo) => {
  await openHome(page);
  await openVouchers(page, 'voucher_history');
  await tab(page, 'Pending').click();
  await action(page, 'View more orders from the past year').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(1);
  await textVisible(record(region(page, 'Pending vouchers'), 'CTRIP20260514001'), '2026-05-14');
});

test('REQ-8.2: Show empty pending voucher state', async ({ page }, testInfo) => {
  await openHome(page);
  await openVouchers(page, 'voucher_read');
  await tab(page, 'Pending').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(0);
  await textVisible(region(page, 'Pending vouchers'), 'No vouchers available');
});

