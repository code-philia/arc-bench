// requirement: REQ-5.17
import { test, expect } from "@playwright/test";
import { field, button, region, record, records, openHome, installClock, isolatedName, openCommon } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.17: Exclude nonmatching notification contacts', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'contact_search', 'Contacts');
  await field(page, 'Contact name').fill(isolatedName('Absent Contact', testInfo));
  await button(page, 'Search contacts').click();
  await expect(records(region(page, 'Contact list'))).toHaveCount(0);
  await expect(record(region(page, 'Contact list'), 'Zhang San')).toHaveCount(0);
});
