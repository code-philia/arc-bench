import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.1.1
// fixtures: personal_center_user, invoice_title_records

test('REQ-5.6.1.1: Search Invoice Titles', async ({ page }) => {
  await h.openInvoiceManager(page);
  await h.fillField(page, [/抬头/, /invoice title/i, /company/i], h.FIXTURES.invoice.title);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectVisible(page, h.FIXTURES.invoice.title);
});
