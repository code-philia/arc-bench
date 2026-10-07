// requirement: REQ-8.1
import { test, expect } from "@playwright/test";
import { region, tab, record, records, visible, openHome, installClock, openVouchers } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-8.1: Read completed voucher and issuance rules', async ({ page }, testInfo) => {
  await openHome(page);
  await openVouchers(page, 'voucher_read');
  for (const name of ['Pending', 'In progress', 'Completed']) await visible(tab(page, name));
  await expect(region(page, 'Issuance rules')).toContainText('365');
  await tab(page, 'Completed').click();
  await expect(records(region(page, 'Completed vouchers'))).toHaveCount(1);
  await visible(record(region(page, 'Completed vouchers'), 'CTRIP20260718004'));
});

