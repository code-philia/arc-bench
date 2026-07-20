import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.3.1: Payment Countdown Reminder', async ({ page }) => {
  await h.openPaymentPage(page);
  await h.expectPaymentPage(page);
});
