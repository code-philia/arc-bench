// requirement: REQ-5.17
import { expect } from "@playwright/test";
import { test, field, button, region, record, records, openHome, openCommon, uniqueName, registerAccount, createContact, contactInput } from "./helpers";

test('REQ-5.17: Exclude nonmatching notification contacts', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Contacts');
  const match = contactInput('Saved contact');
  await createContact(page, match);
  await field(page, 'Contact name').fill(uniqueName('Absent Contact'));
  await button(page, 'Search contacts').click();
  await expect(records(region(page, 'Contact list'))).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), match.name)).toHaveCount(0);
});
