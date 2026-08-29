import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.3.1
// fixtures: booking_page_dataset

test('REQ-4.2.3.1: Reserve an Airport Drop-Off Service', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/接送机/, /drop-off/i, /airport transfer/i]]);
  await h.expectAnyVisible(page, [[/预计/, /estimate/i, /¥/], [/订单总价/, /total/i]]);
});
