import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.3.1
// fixtures: invoice_delete_account, invoice_delete_dataset

test('REQ-5.6.3.1: Delete a Single Receipt', async ({ page }) => {
  await h.openInvoiceManager(page, h.FIXTURES.accounts.invoiceDelete);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
