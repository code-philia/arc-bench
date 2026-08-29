import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.1.1
// fixtures: booking_page_dataset

test('REQ-4.1.1.1: View Reminder Details', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/查看详情/, /details/i, /提醒/]]);
  await h.expectAnyVisible(page, [[/充电宝/, /power bank/i], [/行李额/, /baggage/i]]);
});
