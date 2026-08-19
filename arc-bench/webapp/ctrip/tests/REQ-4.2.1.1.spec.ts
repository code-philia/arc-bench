import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.1.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.2.1.1: Add Combo Insurance', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/保险套餐/, /insurance/i]]);
  await h.expectAnyVisible(page, [[/已选/, /selected/i], [/订单总价/, /total/i]]);
});
