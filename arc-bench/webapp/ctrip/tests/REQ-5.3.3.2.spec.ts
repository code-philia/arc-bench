import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.3.2
// fixtures: traveler_batch_account, traveler_batch_dataset

test('REQ-5.3.3.2: Batch Delete', async ({ page }) => {
  await h.openTravelerManager(page, h.FIXTURES.accounts.travelerBatch);
  await h.setCheckbox(page, [/全选/, /select all/i], true);
  await h.clickFirstAvailable(page, [[/批量删除/, /batch delete/i, /删除/]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /removed/i, /deleted/i]]);
});
