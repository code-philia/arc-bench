import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2.2
// fixtures: voucher_read_account, reimbursement_orders

test('REQ-8.2.2: Find More Historical Orders', async ({ page }) => {
  await h.openVoucherHome(page, h.FIXTURES.accounts.voucherRead);
  await h.clickFirstAvailable(page, [[/查看更多一年内订单/, /more historical orders/i, /更多/]]);
  await h.expectAnyVisible(page, [[/一年内/, /one year/i], [/订单/, /order/i]]);
});
