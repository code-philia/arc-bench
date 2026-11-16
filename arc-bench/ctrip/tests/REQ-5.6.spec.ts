// requirement: REQ-5.6
import { expect } from "@playwright/test";
import { test, field, button, region, record, records, visible, openHome, openCommon, registerAccount, createContact, contactInput } from "./helpers";

test('REQ-5.6: Search a saved contact by name', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Contacts');
  const match = contactInput('Saved contact');
  await createContact(page, match);
  await createContact(page, contactInput('Other contact', false));
  await field(page, 'Contact name').fill(match.name);
  await button(page, 'Search contacts').click();
  await expect(records(region(page, 'Contact list'))).toHaveCount(1);
  await visible(record(region(page, 'Contact list'), match.name));
});
