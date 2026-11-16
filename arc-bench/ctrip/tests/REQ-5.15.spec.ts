// requirement: REQ-5.15
import { test, button, region, record, heading, textVisible, openHome, openCommon, createAddress, addressInput, registerAccount } from "./helpers";

test('REQ-5.15: Inspect a saved mailing address detail', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Addresses');
  const name = addressInput('Address Detail Reader');
  await createAddress(page, name);
  await button(record(region(page, 'Address list'), name.name), 'View address').click();
  await heading(page, 'Address details');
  for (const value of [name.name, name.city, name.district, name.street, name.mobile]) await textVisible(region(page, 'Address details'), value);
});
