import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1.1.1
// fixtures: reimbursement_user, reimbursement_orders

test('REQ-8.1.1.1: Switch to Completed', async ({ page }) => {
  await h.openVoucherHome(page);
  await h.clickFirstAvailable(page, [[/已完成/, /completed/i]]);
  await h.expectAnyVisible(page, [[/已完成/, /completed/i], [/历史/, /history/i, /记录/, /records/i]]);
});
