// requirement: REQ-5.13
import { test, expect } from "@playwright/test";
import { button, region, dialog, checkbox, record, records, visible, openHome, installClock, isolatedName, openCommon, createInvoice } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.13: Delete one invoice title after confirmation', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_delete', 'Invoice titles');
  const target = isolatedName('Invoice Delete One', testInfo);
  const keep = isolatedName('Invoice Keep One', testInfo);
  await createInvoice(page, target, '91310000123456780B');
  await createInvoice(page, keep, '91310000123456781B');
  await visible(record(region(page, 'Invoice title list'), target));
  await button(record(region(page, 'Invoice title list'), target), 'Delete').click();
  await visible(dialog(page, 'Delete invoice title'));
  await visible(record(region(page, 'Invoice title list'), target));
  await button(dialog(page, 'Delete invoice title'), 'Confirm deletion').click();
  await expect(record(region(page, 'Invoice title list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep));
  await page.reload();
  await expect(record(region(page, 'Invoice title list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep));
});

test('REQ-5.13: Delete only selected invoice title records', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_batch', 'Invoice titles');
  const a = isolatedName('Invoice Batch One', testInfo);
  const b = isolatedName('Invoice Batch Two', testInfo);
  const keep = isolatedName('Invoice Keep Two', testInfo);
  await createInvoice(page, a, '91310000123456780B');
  await createInvoice(page, b, '91310000123456781B');
  await createInvoice(page, keep, '91310000123456782B');
  await checkbox(region(page, 'Invoice title list'), a).check();
  await checkbox(region(page, 'Invoice title list'), b).check();
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete invoice titles'), 'Confirm deletion').click();
  await expect(record(region(page, 'Invoice title list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Invoice title list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep));
  await page.reload();
  await expect(record(region(page, 'Invoice title list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Invoice title list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Invoice title list'), keep));
});

