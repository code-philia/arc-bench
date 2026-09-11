import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.2.1
// fixtures: contact_create_account

test('REQ-5.5.2.1: Add a Default Contact', async ({ page }) => {
  await h.openContactManager(page, h.FIXTURES.accounts.contactCreate);
  await h.clickFirstAvailable(page, [[/新增/, /add/i, /新建/]]);
  await h.fillField(page, [/联系人/, /姓名/, /contact/i, /name/i], h.FIXTURES.contact.name);
  await h.fillField(page, [/手机号/, /mobile/i], h.FIXTURES.contact.mobile);
  await h.setCheckbox(page, [/默认/, /default/i], true);
  await h.clickFirstAvailable(page, [[/保存/, /save/i]]);
  await h.expectAnyVisible(page, [[/默认/, /default/i], [h.FIXTURES.contact.name]]);
});
