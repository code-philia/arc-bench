// requirement: REQ-5.6
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, visible, openHome, installClock, openCommon } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.6: Search a saved contact by name', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'contact_search', 'Contacts');
  await field(page, 'Contact name').fill('Zhang San');
  await button(page, 'Search contacts').click();
  await expect(records(region(page, 'Contact list'))).toHaveCount(1);
  await visible(record(region(page, 'Contact list'), 'Zhang San'));
});

