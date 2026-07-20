import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.4.1.1
// fixtures: personal_center_user, address_records

test('REQ-5.4.1.1: View Address List', async ({ page }) => {
  await h.openAddressManager(page);
  await h.expectAnyVisible(page, [[/地址/, /address/i], [/上海/, /city/i]]);
});
