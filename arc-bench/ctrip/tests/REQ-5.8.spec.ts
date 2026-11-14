// requirement: REQ-5.8
import { expect } from "@playwright/test";
import { test, field, button, region, record, records, textVisible, openHome, openCommon, registerAccount, createInvoice, invoiceInput, uniqueName } from "./helpers";

test('REQ-5.8: Find company title by keyword', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  const keyword = uniqueName('Company');
  const match = invoiceInput(keyword);
  await createInvoice(page, match);
  await createInvoice(page, invoiceInput('Other company'));
  await field(page, 'Search invoice titles').fill(keyword);
  await button(page, 'Search').click();
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Invoice title list'), match.name), match.taxId);
});
