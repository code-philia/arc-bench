// requirement: REQ-5.7
import { expect } from "@playwright/test";
import { test, region, record, records, textVisible, openHome, openCommon, createContact, contactInput, registerAccount } from "./helpers";

test('REQ-5.7: Save contact with default designation', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Contacts');
  const name = contactInput('Wang Wu');
  await createContact(page, name);
  await expect(records(region(page, 'Contact list'))).toHaveCount(1);
  for (const value of [name.mobile, name.email, 'Default']) await textVisible(record(region(page, 'Contact list'), name.name), value);
  await page.reload();
  for (const value of [name.mobile, name.email, 'Default']) await textVisible(record(region(page, 'Contact list'), name.name), value);
});
