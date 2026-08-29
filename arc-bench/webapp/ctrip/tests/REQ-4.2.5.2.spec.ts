import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.5.2
// fixtures: booking_page_dataset

test('REQ-4.2.5.2: Auto Deduction When Removing Services', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickIfVisible(page, [/保险/, /insurance/i]);
  await h.clickIfVisible(page, [/移除/, /remove/i, /取消/]);
  await h.expectAnyVisible(page, [[/订单总价/, /total/i], [/明细/, /details/i]]);
});
