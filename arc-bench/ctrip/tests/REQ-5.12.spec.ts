// requirement: REQ-5.12
import { test, expect } from "@playwright/test";
import { button, region, dialog, checkbox, record, records, visible, openHome, installClock, isolatedName, openCommon, createContact } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.12: Delete one contact after confirmation', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'contact_delete', 'Contacts');
  const target = isolatedName('Contact Delete A', testInfo);
  const keep = isolatedName('Contact Keep A', testInfo);
  await createContact(page, target);
  await createContact(page, keep);
  await visible(record(region(page, 'Contact list'), target));
  await button(record(region(page, 'Contact list'), target), 'Delete').click();
  await visible(dialog(page, 'Delete contact'));
  await visible(record(region(page, 'Contact list'), target));
  await button(dialog(page, 'Delete contact'), 'Confirm deletion').click();
  await expect(record(region(page, 'Contact list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep));
  await page.reload();
  await expect(record(region(page, 'Contact list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep));
});

test('REQ-5.12: Delete only selected contact records', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'contact_batch_1', 'Contacts');
  const a = isolatedName('Contact Batch One A', testInfo);
  const b = isolatedName('Contact Batch One B', testInfo);
  const keep = isolatedName('Contact Keep One', testInfo);
  await createContact(page, a);
  await createContact(page, b);
  await createContact(page, keep);
  await checkbox(region(page, 'Contact list'), a).check();
  await checkbox(region(page, 'Contact list'), b).check();
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete contacts'), 'Confirm deletion').click();
  await expect(record(region(page, 'Contact list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep));
  await page.reload();
  await expect(record(region(page, 'Contact list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep));
});

test('REQ-5.12: Delete only selected contact records in second account', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'contact_batch_2', 'Contacts');
  const a = isolatedName('Contact Batch Two A', testInfo);
  const b = isolatedName('Contact Batch Two B', testInfo);
  const keep = isolatedName('Contact Keep Two', testInfo);
  await createContact(page, a);
  await createContact(page, b);
  await createContact(page, keep);
  await checkbox(region(page, 'Contact list'), a).check();
  await checkbox(region(page, 'Contact list'), b).check();
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete contacts'), 'Confirm deletion').click();
  await expect(record(region(page, 'Contact list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep));
  await page.reload();
  await expect(record(region(page, 'Contact list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep));
});

