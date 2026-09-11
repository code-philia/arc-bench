import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1.1.1
// fixtures: voucher_read_account, reimbursement_orders

test('REQ-8.1.1.1: Switch to Completed', async ({ page }) => {
  await h.openVoucherHome(page, h.FIXTURES.accounts.voucherRead);
  await h.clickFirstAvailable(page, [[/已完成/, /completed/i]]);
  await h.expectAnyVisible(page, [[/已完成/, /completed/i], [/历史/, /history/i, /记录/, /records/i]]);
});
