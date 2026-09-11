import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.1
// fixtures: booking_page_dataset, payment_pending_flight

test('REQ-4.3.1: Payment Countdown Reminder', async ({ page }) => {
  await h.openPaymentPage(page, h.FIXTURES.flightSearch.paymentPending);
  await h.expectPaymentPage(page);
});
