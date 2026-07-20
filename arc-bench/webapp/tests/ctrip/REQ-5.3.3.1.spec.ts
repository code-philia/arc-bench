import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.3.1
// fixtures: personal_center_user, traveler_records

test('REQ-5.3.3.1: Delete a Traveler Record', async ({ page }) => {
  await h.openTravelerManager(page);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /removed/i, /deleted/i]]);
});
