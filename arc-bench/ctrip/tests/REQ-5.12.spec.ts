// requirement: REQ-5.12
import { expect } from "@playwright/test";
import { test, setChecked, button, region, dialog, record, visible, openHome, openCommon, createContact, contactInput, registerAccount, recordCheckbox } from "./helpers";

test('REQ-5.12: Delete one contact after confirmation', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Contacts');
  const target = contactInput('Contact Delete A');
  const keep = contactInput('Contact Keep A');
  await createContact(page, target);
  await createContact(page, keep);
  await visible(record(region(page, 'Contact list'), target.name));
  await button(record(region(page, 'Contact list'), target.name), 'Delete').click();
  await visible(dialog(page, 'Delete contact'));
  await visible(record(region(page, 'Contact list'), target.name));
  await button(dialog(page, 'Delete contact'), 'Confirm deletion').click();
  await expect(record(region(page, 'Contact list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Contact list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep.name));
});

test('REQ-5.12: Delete only selected contact records', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Contacts');
  const a = contactInput('Contact Batch One A');
  const b = contactInput('Contact Batch One B');
  const keep = contactInput('Contact Keep One');
  await createContact(page, a);
  await createContact(page, b);
  await createContact(page, keep);
  await setChecked(recordCheckbox(region(page, 'Contact list'), a.name));
  await setChecked(recordCheckbox(region(page, 'Contact list'), b.name));
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete contacts'), 'Confirm deletion').click();
  await expect(record(region(page, 'Contact list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Contact list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Contact list'), keep.name));
});
