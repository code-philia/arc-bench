import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.3
// fixtures: registered_user, address_book

test('REQ-8.4.3: Edit Address', async ({ page }) => {
  await h.openAddressBook(page);
  await h.clickFirstAvailable(page, [[/update/i, /edit/i]]);
  await h.expectTextsVisible(page, [/alias/i, /address/i]);
  await h.fillField(page, [/address/i], h.FIXTURES.address.updatedAddress1);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [/updated|saved|success/i]);
});
