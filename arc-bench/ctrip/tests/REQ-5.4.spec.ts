// requirement: REQ-5.4
import { expect } from "@playwright/test";
import { test, region, record, records, textVisible, openHome, openCommon, registerAccount, addressInput, createAddress } from "./helpers";

test('REQ-5.4: Read recipient and delivery location', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Addresses');
  const address = addressInput('Recipient');
  await createAddress(page, address);
  await expect(records(region(page, 'Address list'))).toHaveCount(1);
  for (const value of [address.city, address.district, address.street]) await textVisible(record(region(page, 'Address list'), address.name), value);
});
