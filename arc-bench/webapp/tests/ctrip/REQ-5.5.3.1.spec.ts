import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.3.1
// fixtures: personal_center_user, contact_records

test('REQ-5.5.3.1: Delete a Single Contact', async ({ page }) => {
  await h.openContactManager(page);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
