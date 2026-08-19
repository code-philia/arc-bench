import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.4.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.2.4.1: Purchase Lounge Service', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/休息室/, /lounge/i, /贵宾/]]);
  await h.expectAnyVisible(page, [[/订单总价/, /total/i], [/休息室/, /lounge/i]]);
});
