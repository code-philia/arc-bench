// requirement: REQ-8.4
import { expect } from "@playwright/test";
import { test, region, tab, record, records, textVisible, openHome, openVouchers, VOUCHERS, registerAccount } from "./helpers";

test('REQ-8.4: Keep eligible reimbursement orders scoped to account', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openVouchers(page);
  await tab(page, 'Pending').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(0);
  await textVisible(region(page, 'Pending vouchers'), 'No vouchers available');
  await expect(record(region(page, 'Pending vouchers'), VOUCHERS.recent)).toHaveCount(0);
  await expect(record(region(page, 'Pending vouchers'), VOUCHERS.older)).toHaveCount(0);
});
