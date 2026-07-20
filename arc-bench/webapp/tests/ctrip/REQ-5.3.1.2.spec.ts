import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.1.2
// fixtures: personal_center_user, traveler_records

test('REQ-5.3.1.2: No Matching Traveler Found', async ({ page }) => {
  await h.openTravelerManager(page);
  await h.fillField(page, [/旅客/, /姓名/, /traveler/i, /name/i], '不存在用户');
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/未找到/, /no matching/i, /无结果/]]);
});
