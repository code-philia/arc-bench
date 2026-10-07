// requirement: REQ-3.8
import { test, expect } from "@playwright/test";
import { visible, heading, textVisible, openHome, installClock, openBooking, submitBooking, countdownSeconds } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.8: Submit a valid unpaid booking', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await submitBooking(page);
  await heading(page, 'Payment');
  await visible(page.getByRole('timer', { name: 'Time remaining', exact: true }));
  expect(await countdownSeconds(page.getByRole('timer', { name: 'Time remaining', exact: true }))).toBeGreaterThan(0);
  await textVisible(page, 'Unpaid orders are cancelled when the timer expires');
});

