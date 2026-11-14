// requirement: REQ-8.3
import { expect } from "@playwright/test";
import { test, tripDate, action, region, tab, record, records, visible, textVisible, openHome, openVouchers, VOUCHERS } from "./helpers";

test('REQ-8.3: Show currently eligible pending order', async ({ page }) => {
  await openHome(page);
  await openVouchers(page, 'voucher_pending');
  await tab(page, 'Pending').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(1);
  await visible(record(region(page, 'Pending vouchers'), VOUCHERS.recent));
});

test('REQ-8.3: Load older eligible order from past year', async ({ page }) => {
  await openHome(page);
  await openVouchers(page, 'voucher_history');
  await tab(page, 'Pending').click();
  await action(page, 'View more orders from the past year').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(1);
  await textVisible(record(region(page, 'Pending vouchers'), VOUCHERS.older), tripDate(page, -66));
});

test('REQ-8.3: Show empty pending voucher state', async ({ page }) => {
  await openHome(page);
  await openVouchers(page, 'voucher_read');
  await tab(page, 'Pending').click();
  await expect(records(region(page, 'Pending vouchers'))).toHaveCount(0);
  await textVisible(region(page, 'Pending vouchers'), 'No vouchers available');
});
