import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.5.1
// fixtures: booking_user, booking_page_dataset

test('REQ-4.1.5.1: Modify Contact Mobile Number', async ({ page }) => {
  await h.openBookingPage(page);
  await h.fillField(page, [/联系人手机/, /手机号/, /mobile/i], h.FIXTURES.booking.mobile);
  await h.expectFieldValue(page, [/联系人手机/, /手机号/, /mobile/i], h.FIXTURES.booking.mobile);
});
