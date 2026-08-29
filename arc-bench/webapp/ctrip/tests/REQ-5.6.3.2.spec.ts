import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.3.2
// fixtures: invoice_batch_account, invoice_batch_dataset

test('REQ-5.6.3.2: Batch Delete Receipts', async ({ page }) => {
  await h.openInvoiceManager(page, h.FIXTURES.accounts.invoiceBatch);
  await h.setCheckbox(page, [/全选/, /select all/i], true);
  await h.clickFirstAvailable(page, [[/批量删除/, /batch delete/i, /删除/]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
