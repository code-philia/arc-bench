// requirement: REQ-5.7
import { test, expect } from "@playwright/test";
import { region, record, records, textVisible, openHome, installClock, isolatedName, openCommon, createContact } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.7: Save contact with default designation', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'contact_create', 'Contacts');
  const name = isolatedName('Wang Wu', testInfo);
  await createContact(page, name);
  await expect(records(region(page, 'Contact list'))).toHaveCount(1);
  for (const value of ['13800000017', 'wang.wu@example.com', 'Default']) await textVisible(record(region(page, 'Contact list'), name), value);
  await page.reload();
  await textVisible(record(region(page, 'Contact list'), name), 'Default');
});

