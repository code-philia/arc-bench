import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.3.1
// fixtures: personal_center_user, address_records

test('REQ-5.4.3.1: Delete a Single Address', async ({ page }) => {
  await h.openAddressManager(page);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
