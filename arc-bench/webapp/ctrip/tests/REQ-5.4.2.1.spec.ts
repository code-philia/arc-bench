import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.2.1
// fixtures: address_create_account

test('REQ-5.4.2.1: Save a New Address', async ({ page }) => {
  await h.openAddressManager(page, h.FIXTURES.accounts.addressCreate);
  await h.clickFirstAvailable(page, [[/新增/, /add/i, /新建/]]);
  await h.fillField(page, [/收货人/, /consignee/i, /name/i], h.FIXTURES.address.consignee);
  await h.fillField(page, [/城市/, /city/i], h.FIXTURES.address.city);
  await h.fillField(page, [/详细地址/, /detail/i, /address/i], h.FIXTURES.address.detail);
  await h.clickFirstAvailable(page, [[/保存/, /save/i]]);
  await h.expectVisible(page, h.FIXTURES.address.detail);
});
