// requirement: REQ-3.8
import { expect } from "@playwright/test";
import { test, visible, heading, textVisible, openHome, openBooking, submitBooking, countdownSeconds, timer } from "./helpers";

test('REQ-3.8: Submit a valid unpaid booking', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await submitBooking(page);
  await heading(page, 'Payment');
  await visible(timer(page));
  expect(await countdownSeconds(timer(page))).toBeGreaterThan(0);
  await textVisible(page, 'Unpaid orders are cancelled when the timer expires');
});
