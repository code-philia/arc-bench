import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.6.1
// fixtures: booking_page_dataset

test('REQ-4.1.6.1: Real-Time Fee Calculation', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/保险/, /insurance/i]]);
  await h.expectAnyVisible(page, [[/订单总价/, /total/i], [/明细/, /details/i]]);
});
