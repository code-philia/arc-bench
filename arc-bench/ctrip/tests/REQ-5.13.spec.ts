// requirement: REQ-5.13
import { expect } from "@playwright/test";
import { test, setChecked, button, region, dialog, record, visible, openHome, openCommon, createInvoice, invoiceInput, registerAccount, recordCheckbox } from "./helpers";

test('REQ-5.13: Delete one invoice title after confirmation', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  const target = invoiceInput('Invoice Delete One');
  const keep = invoiceInput('Invoice Keep One');
  await createInvoice(page, target);
  await createInvoice(page, keep);
  await visible(record(region(page, 'Invoice title list'), target.name));
  await button(record(region(page, 'Invoice title list'), target.name), 'Delete').click();
  await visible(dialog(page, 'Delete invoice title'));
  await visible(record(region(page, 'Invoice title list'), target.name));
  await button(dialog(page, 'Delete invoice title'), 'Confirm deletion').click();
  await expect(record(region(page, 'Invoice title list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Invoice title list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep.name));
});

test('REQ-5.13: Delete only selected invoice title records', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  const a = invoiceInput('Invoice Batch One');
  const b = invoiceInput('Invoice Batch Two');
  const keep = invoiceInput('Invoice Keep Two');
  await createInvoice(page, a);
  await createInvoice(page, b);
  await createInvoice(page, keep);
  await setChecked(recordCheckbox(region(page, 'Invoice title list'), a.name));
  await setChecked(recordCheckbox(region(page, 'Invoice title list'), b.name));
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete invoice titles'), 'Confirm deletion').click();
  await expect(record(region(page, 'Invoice title list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Invoice title list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Invoice title list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Invoice title list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep.name));
});
