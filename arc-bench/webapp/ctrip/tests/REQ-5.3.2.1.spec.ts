import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.2.1
// fixtures: personal_center_user, traveler_records

test('REQ-5.3.2.1: Create a New Traveler', async ({ page }) => {
  await h.openTravelerManager(page);
  await h.clickFirstAvailable(page, [[/新增/, /add/i, /新建/]]);
  await h.fillField(page, [/中文名/, /姓名/, /name/i], h.FIXTURES.booking.travelerName);
  await h.fillField(page, [/证件号码/, /ID number/i], h.FIXTURES.booking.validIdNumber);
  await h.clickFirstAvailable(page, [[/保存/, /save/i]]);
  await h.expectAnyVisible(page, [[/成功/, /saved/i, h.FIXTURES.booking.travelerName]]);
});
