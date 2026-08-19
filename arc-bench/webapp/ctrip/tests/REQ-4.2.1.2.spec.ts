import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.1.2
// fixtures: booking_user, booking_page_dataset

test('REQ-4.2.1.2: View Insurance Terms', async ({ page }) => {
  await h.openBookingPage(page);
  await h.clickFirstAvailable(page, [[/保险条款/, /terms/i, /coverage/i]]);
  await h.expectAnyVisible(page, [[/保障范围/, /coverage/i], [/理赔/, /claim/i]]);
});
