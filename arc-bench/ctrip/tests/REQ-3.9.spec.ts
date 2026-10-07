// requirement: REQ-3.9
import { test, expect } from "@playwright/test";
import { button, radio, visible, textVisible, openHome, installClock, openBooking, submitBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.9: Pay with simulated Alipay', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await submitBooking(page);
  await radio(page, 'Alipay').check();
  await button(page, 'Pay now').click();
  await visible(page.getByRole('status').filter({ hasText: 'Payment successful' }));
  await textVisible(page, 'JD5162');
});

