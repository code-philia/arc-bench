import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2.1
// fixtures: reimbursement_user, reimbursement_orders

test('REQ-8.2.1: View Eligible Orders', async ({ page }) => {
  await h.openVoucherHome(page);
  await h.clickFirstAvailable(page, [[/待开具/, /pending/i]]);
  await h.expectAnyVisible(page, [[/您暂无报销凭证可开具/, /no voucher/i], [/订单/, /order/i]]);
});
