// requirement: REQ-5.5
import { expect } from "@playwright/test";
import { test, region, record, records, textVisible, openHome, openCommon, createAddress, addressInput, registerAccount } from "./helpers";

test('REQ-5.5: Save recipient delivery address', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Addresses');
  const name = addressInput('Wang Wu');
  await createAddress(page, name);
  await expect(records(region(page, 'Address list'))).toHaveCount(1);
  for (const value of [name.city, name.district, name.street]) await textVisible(record(region(page, 'Address list'), name.name), value);
  await page.reload();
  for (const value of [name.city, name.district, name.street]) await textVisible(record(region(page, 'Address list'), name.name), value);
});
