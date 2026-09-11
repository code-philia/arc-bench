import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.3.2
// fixtures: contact_batch_2_account, contact_batch_2_dataset

test('REQ-5.5.3.2: Batch Delete Contacts', async ({ page }) => {
  await h.openContactManager(page, h.FIXTURES.accounts.contactBatch2);
  await h.setCheckbox(page, [/全选/, /select all/i], true);
  await h.clickFirstAvailable(page, [[/批量删除/, /batch delete/i, /删除/]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
