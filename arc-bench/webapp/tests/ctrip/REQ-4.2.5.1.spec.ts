import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.5.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.2.5.1: Linked Pricing for Value-Added Services', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickIfVisible(page, [/保险/, /insurance/i]);
  await h.clickIfVisible(page, [/额外行李额/, /extra baggage/i]);
  await h.clickFirstAvailable(page, [[/明细/, /details/i]]);
  await h.expectAnyVisible(page, [[/订单总价/, /total/i], [/保险/, /行李/, /baggage/i]]);
});
