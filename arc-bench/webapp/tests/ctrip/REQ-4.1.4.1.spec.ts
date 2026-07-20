import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.4.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.1.4.1: Trigger Add Passenger', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/新增乘机人/, /add passenger/i, /添加乘机人/]]);
  await h.expectAnyVisible(page, [[/乘机人/, /旅客/, /passenger/i], [/证件号码/, /ID number/i]]);
});
