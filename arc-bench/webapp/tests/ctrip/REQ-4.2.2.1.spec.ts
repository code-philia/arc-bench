import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.2.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.2.2.1: View Free Baggage Allowance', async ({ page }) => {
  await h.openBookingPage(page);
  await h.expectAnyVisible(page, [[/免费携带/, /baggage/i, /KG/]]);
});
