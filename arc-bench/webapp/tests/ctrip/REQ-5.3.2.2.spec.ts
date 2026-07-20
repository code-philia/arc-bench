import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.2.2
// fixtures: personal_center_user, traveler_records

test('REQ-5.3.2.2: Exception: Required-Field Validation', async ({ page }) => {
  await h.openTravelerManager(page);
  await h.clickFirstAvailable(page, [[/新增/, /add/i, /新建/]]);
  await h.clickFirstAvailable(page, [[/保存/, /save/i]]);
  await h.expectErrorFeedback(page, [/中文名与英文名两者必填一项/, /required/i]);
});
