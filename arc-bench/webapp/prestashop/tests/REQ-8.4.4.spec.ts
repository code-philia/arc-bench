import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.4
// fixtures: accounts.addressDelete, address.home

test('REQ-8.4.4: Delete Address', async ({ page }) => {
  await h.openAddressBook(page, h.FIXTURES.accounts.addressDelete);
  await h.clickFirstAvailable(page, [[/delete/i]]);
  await h.expectTextsVisible(page, [/address/i, /deleted|removed|success/i]);
});
