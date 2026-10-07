// requirement: REQ-8.3
import { test, expect } from "@playwright/test";
import { region, tab, record, records, textVisible, openHome, installClock, openVouchers } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-8.3: Keep eligible reimbursement orders scoped to account', async ({ page }, testInfo) => {
  await openHome(page);
  await openVouchers(page, 'profile_read');
  await tab(page, 'Pending').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(0);
  await textVisible(region(page, 'Pending vouchers'), 'No vouchers available');
  await expect(record(region(page, 'Pending vouchers'), 'CTRIP20260721005')).toHaveCount(0);
  await expect(record(region(page, 'Pending vouchers'), 'CTRIP20260514001')).toHaveCount(0);
});
