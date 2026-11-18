// requirement: REQ-3.8
import { expect } from "@playwright/test";
import { test, heading, textVisible, openHome, openBooking, submitBooking, countdownSeconds, timer, unpaidOrderExpiry } from "./helpers";
import { preferredVisible } from './ui';

test('REQ-3.8: Submit a valid unpaid booking', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await submitBooking(page);
  await heading(page, 'Payment');
  const countdown = await preferredVisible(page.getByRole('timer', { name: 'Time remaining', exact: true }),
    timer(page), page.getByRole('timer'));
  if (!(await page.getByRole('timer', { name: 'Time remaining', exact: true }).count())) {
    await expect(countdown.locator('..')).toContainText(/(?:\bTime remaining\b|剩余时间)/i);
  }
  expect(await countdownSeconds(countdown)).toBeGreaterThan(0);
  await textVisible(page, unpaidOrderExpiry);
});
