// requirement: REQ-5.18
import { expect } from "@playwright/test";
import { test, field, button, region, record, records, openHome, openCommon, uniqueName, registerAccount, createInvoice, invoiceInput } from "./helpers";

test('REQ-5.18: Exclude nonmatching invoice titles', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  const keyword = uniqueName('Company');
  const match = invoiceInput(keyword);
  await createInvoice(page, match);
  await field(page, 'Search invoice titles').fill(uniqueName('Absent Invoice'));
  await button(page, 'Search').click();
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(0);
  await expect(record(region(page, 'Invoice title list'), match.name)).toHaveCount(0);
});
