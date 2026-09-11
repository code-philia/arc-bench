import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.5.3.1
// fixtures: contact_delete_account, contact_delete_dataset

test('REQ-5.5.3.1: Delete a Single Contact', async ({ page }) => {
  await h.openContactManager(page, h.FIXTURES.accounts.contactDelete);
  await h.clickFirstAvailable(page, [[/删除/, /delete/i]]);
  await h.confirmDialog(page);
  await h.expectAnyVisible(page, [[/成功/, /deleted/i, /removed/i]]);
});
