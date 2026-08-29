import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.1.1
// fixtures: contact_search_account, contact_search_dataset

test('REQ-5.5.1.1: Search Contacts', async ({ page }) => {
  await h.openContactManager(page, h.FIXTURES.accounts.contactSearch);
  await h.fillField(page, [/联系人/, /姓名/, /contact/i, /name/i], h.FIXTURES.contact.name);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectVisible(page, h.FIXTURES.contact.name);
});
