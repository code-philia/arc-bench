import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.4.1
// fixtures: registered_user, address_book

test('REQ-8.4.1: View Address List', async ({ page }) => {
  await h.openAddressBook(page);
  await h.expectTextsVisible(page, [/addresses/i, h.FIXTURES.address.alias]);
});
