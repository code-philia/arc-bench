import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.1.1
// fixtures: personal_read_account, traveler_read_dataset

test('REQ-5.3.1.1: Search for a Traveler', async ({ page }) => {
  await h.openTravelerManager(page, h.FIXTURES.accounts.personalRead);
  await h.fillField(page, [/旅客/, /姓名/, /traveler/i, /name/i], h.FIXTURES.booking.secondTravelerName);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectVisible(page, h.FIXTURES.booking.secondTravelerName);
});
