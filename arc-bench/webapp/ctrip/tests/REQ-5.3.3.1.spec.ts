import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.3.1
// fixtures: traveler_delete_account, traveler_delete_dataset

test('REQ-5.3.3.1: Delete a Traveler Record', async ({ page }) => {
  await h.openTravelerManager(page, h.FIXTURES.accounts.travelerDelete);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /removed/i, /deleted/i]]);
});
