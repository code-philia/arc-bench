import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.2
// fixtures: registered_user, address_book

test('REQ-8.4.2: Add New Address', async ({ page }) => {
  await h.openAddressBook(page);
  await h.clickFirstAvailable(page, [[/create new address/i, /add first address/i]]);
  await h.expectTextsVisible(page, [/alias/i, /address/i, /city/i, /country/i]);
  await h.fillField(page, [/alias/i], h.FIXTURES.address.newAlias);
  await h.fillField(page, [/first name/i], h.FIXTURES.account.firstName);
  await h.fillField(page, [/last name/i], h.FIXTURES.account.lastName);
  await h.fillField(page, [/address/i], h.FIXTURES.address.address1);
  await h.fillField(page, [/zip|postal/i], h.FIXTURES.address.postalCode);
  await h.fillField(page, [/city/i], h.FIXTURES.address.city);
  await h.chooseOption(page, [/country/i], h.FIXTURES.address.country);
  await h.fillField(page, [/phone/i], h.FIXTURES.address.phone);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.address.newAlias, /address/i]);
});
