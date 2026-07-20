import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.2.1
// fixtures: personal_center_user, invoice_title_records

test('REQ-5.6.2.1: Add a Company Invoice Title', async ({ page }) => {
  await h.openInvoiceManager(page);
  await h.clickFirstAvailable(page, [[/新增/, /add/i, /新建/]]);
  await h.fillField(page, [/抬头/, /invoice title/i, /company/i], h.FIXTURES.invoice.title);
  await h.fillField(page, [/税号/, /tax/i], h.FIXTURES.invoice.taxId);
  await h.clickFirstAvailable(page, [[/保存/, /save/i]]);
  await h.expectAnyVisible(page, [[h.FIXTURES.invoice.title], [/税号/, /tax/i]]);
});
