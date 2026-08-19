import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.3.1
// fixtures: personal_center_user, invoice_title_records

test('REQ-5.6.3.1: Delete a Single Receipt', async ({ page }) => {
  await h.openInvoiceManager(page);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
