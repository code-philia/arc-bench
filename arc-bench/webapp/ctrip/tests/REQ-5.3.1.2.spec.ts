import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.1.2
// fixtures: personal_read_account, traveler_read_dataset

test('REQ-5.3.1.2: No Matching Traveler Found', async ({ page }) => {
  await h.openTravelerManager(page, h.FIXTURES.accounts.personalRead);
  await h.fillField(page, [/旅客/, /姓名/, /traveler/i, /name/i], '不存在用户');
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/未找到/, /no matching/i, /无结果/]]);
});
