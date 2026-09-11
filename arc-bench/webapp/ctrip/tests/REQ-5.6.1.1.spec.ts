import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.1.1
// fixtures: invoice_search_account, invoice_search_dataset

test('REQ-5.6.1.1: Search Invoice Titles', async ({ page }) => {
  await h.openInvoiceManager(page, h.FIXTURES.accounts.invoiceSearch);
  await h.fillField(page, [/抬头/, /invoice title/i, /company/i], h.FIXTURES.invoice.title);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectVisible(page, h.FIXTURES.invoice.title);
});
