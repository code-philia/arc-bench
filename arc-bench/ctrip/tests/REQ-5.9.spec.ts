// requirement: REQ-5.9
import { test, expect } from "@playwright/test";
import { field, button, region, checkbox, record, records, visible, textVisible, openHome, installClock, isolatedName, openCommon, createInvoice } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.9: Save company title and taxpayer identity', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_create', 'Invoice titles');
  const name = isolatedName('Shanghai Create Technology Co., Ltd.', testInfo);
  await createInvoice(page, name, '91310000123456789B');
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Invoice title list'), name), '91310000123456789B');
  await page.reload();
  await textVisible(record(region(page, 'Invoice title list'), name), '91310000123456789B');
});

test('REQ-5.9: Reveal special VAT fields', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_vat', 'Invoice titles');
  await button(page, 'Add invoice title').click();
  await checkbox(region(page, 'Add invoice title'), 'Special VAT invoice').check();
  for (const name of ['Registered address', 'Registered phone', 'Bank name', 'Bank account']) await visible(field(region(page, 'Add invoice title'), name));
});

test('REQ-5.9: Require company taxpayer ID', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'invoice_create', 'Invoice titles');
  const before = await records(region(page, 'Invoice title list')).count();
  const name = isolatedName('Missing tax ID', testInfo);
  await button(page, 'Add invoice title').click();
  await field(region(page, 'Add invoice title'), 'Type').selectOption({ label: 'Company' });
  await field(region(page, 'Add invoice title'), 'Invoice title').fill(name);
  await button(region(page, 'Add invoice title'), 'Save').click();
  await visible(region(page, 'Add invoice title'));
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(before);
  await expect(record(region(page, 'Invoice title list'), name)).toHaveCount(0);
});

