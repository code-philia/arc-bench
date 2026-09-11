import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.2.1
// fixtures: booking_page_dataset

test('REQ-4.1.2.1: Quickly Select Passengers', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/常用旅客/, /quick select/i, /选择旅客/, /passenger/i]]);
  await h.expectAnyVisible(page, [[/张三/, /李四/, /旅客/, /passenger/i]]);
});
