import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.1
// fixtures: profile_user

test('REQ-6.2.1: Update Profile and Save', async ({ page }) => {
  await h.openProfileOverview(page);
  await h.clickFirstAvailable(page, [[/编辑/, /edit/i]]);
  await h.fillField(page, [/昵称/, /姓名/, /name/i], h.FIXTURES.profile.updatedDisplayName);
  await h.clickFirstAvailable(page, [[/保存/, /save/i]]);
  await h.expectAnyVisible(page, [[/成功/, /saved/i], [h.FIXTURES.profile.updatedDisplayName]]);
});
