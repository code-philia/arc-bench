// requirement: REQ-5.9
import { expect } from "@playwright/test";
import { test, setChecked, field, button, region, checkbox, record, records, visible, textVisible, openHome, openCommon, createInvoice, selectChoice, invoiceInput, registerAccount, uniqueName } from "./helpers";

test('REQ-5.9: Save company title and taxpayer identity', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  const name = invoiceInput('Shanghai Create Technology Co., Ltd.');
  await createInvoice(page, name);
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Invoice title list'), name.name), name.taxId);
  await page.reload();
  await textVisible(record(region(page, 'Invoice title list'), name.name), name.taxId);
});

test('REQ-5.9: Reveal special VAT fields', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  await button(page, 'Add invoice title').click();
  await setChecked(checkbox(region(page, 'Add invoice title'), 'Special VAT invoice'));
  for (const name of ['Registered address', 'Registered phone', 'Bank name', 'Bank account']) await visible(field(region(page, 'Add invoice title'), name));
});

test('REQ-5.9: Require company taxpayer ID', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Invoice titles');
  const before = await records(region(page, 'Invoice title list')).count();
  const name = uniqueName('Missing tax ID');
  await button(page, 'Add invoice title').click();
  await selectChoice(region(page, 'Add invoice title'), 'Type', 'Company');
  await field(region(page, 'Add invoice title'), 'Invoice title').fill(name);
  await button(region(page, 'Add invoice title'), 'Save').click();
  await visible(region(page, 'Add invoice title'));
  await expect(records(region(page, 'Invoice title list'))).toHaveCount(before);
  await expect(record(region(page, 'Invoice title list'), name)).toHaveCount(0);
});
