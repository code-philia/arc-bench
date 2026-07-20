import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.2.2
// fixtures: booking_user, booking_page_dataset

test('REQ-4.2.2.2: Purchase Extra Baggage Allowance', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/额外行李额/, /extra baggage/i, /购买/]]);
  await h.expectAnyVisible(page, [[/订单总价/, /total/i], [/行李额/, /baggage/i]]);
});
