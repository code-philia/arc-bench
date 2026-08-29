import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.3.1
// fixtures: booking_page_dataset

test('REQ-4.1.3.1: Enter ID Information (Normal Flow)', async ({ page }) => {
  await h.openBookingPage(page);
  await h.fillField(page, [/证件号码/, /ID number/i], h.FIXTURES.booking.validIdNumber);
  await h.expectFieldValue(page, [/证件号码/, /ID number/i], h.FIXTURES.booking.validIdNumber);
});
