// requirement: REQ-4.4
import { test, expect } from "@playwright/test";
import { button, region, visible, heading, textVisible, openHome, installClock, openOrderDetails, countdownSeconds } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.4: Inspect unpaid itinerary and payment countdown', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrderDetails(page, 'order_read', 'CTRIP20260721001');
  await heading(page, 'Order details');
  await textVisible(page, 'CTRIP20260721001');
  await textVisible(page, 'JD5162');
  await textVisible(page, 'Chengdu to Guangzhou');
  await visible(button(region(page, 'Flight itinerary'), 'Refund and change rules'));
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  await textVisible(region(page, 'Payment status'), 'Unpaid orders are cancelled when the timer expires');
  await visible(button(region(page, 'Payment status'), 'Pay now'));
  await visible(button(region(page, 'Payment status'), 'Cancel order'));
  const timer = region(page, 'Payment status').getByRole('timer', { name: 'Time remaining', exact: true });
  await visible(timer);
  const before = await countdownSeconds(timer);
  expect(before).toBeGreaterThan(0);
  await page.clock.runFor(1100);
  await expect.poll(() => countdownSeconds(timer)).toBeLessThan(before);
});

test('REQ-4.4: Read refund and change conditions', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrderDetails(page, 'order_read', 'CTRIP20260721001');
  await button(region(page, 'Flight itinerary'), 'Refund and change rules').click();
  await textVisible(region(page, 'Flight itinerary'), 'Refund fee: ¥100');
  await textVisible(region(page, 'Flight itinerary'), 'Changes allowed before departure');
});

