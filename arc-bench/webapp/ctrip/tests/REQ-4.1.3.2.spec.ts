import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.3.2
// fixtures: booking_user, booking_page_dataset

test('REQ-4.1.3.2: Exception: Invalid ID Number Format', async ({ page }) => {
  await h.openBookingPage(page);
  await h.fillField(page, [/证件号码/, /ID number/i], h.FIXTURES.booking.invalidIdNumber);
  await h.clickIfVisible(page, [/联系人手机/, /mobile/i]);
  await h.expectErrorFeedback(page, [/请输入正确的证件号码/, /invalid ID/i]);
});
