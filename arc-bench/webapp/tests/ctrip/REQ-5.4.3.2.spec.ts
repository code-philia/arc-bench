import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.3.2
// fixtures: personal_center_user, address_records

test('REQ-5.4.3.2: Batch Delete Addresses', async ({ page }) => {
  await h.openAddressManager(page);
  await h.setCheckbox(page, [/全选/, /select all/i], true);
  await h.clickFirstAvailable(page, [[/批量删除/, /batch delete/i, /删除/]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
