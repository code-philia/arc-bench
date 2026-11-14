// requirement: REQ-4.4
import { expect } from "@playwright/test";
import { test, button, region, visible, heading, textVisible, openHome, bookUnpaidOrder, countdownSeconds, timer } from "./helpers";

test('REQ-4.4: Inspect unpaid itinerary and payment countdown', async ({ page }) => {
  await openHome(page);
  const number = await bookUnpaidOrder(page);
  await heading(page, 'Order details');
  await textVisible(page, number);
  await textVisible(region(page, 'Flight itinerary'), 'JD5162');
  await textVisible(region(page, 'Flight itinerary'), 'Chengdu to Guangzhou');
  await visible(button(region(page, 'Flight itinerary'), 'Refund and change rules'));
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  await textVisible(region(page, 'Payment status'), 'Unpaid orders are cancelled when the timer expires');
  await visible(button(region(page, 'Payment status'), 'Pay now'));
  await visible(button(region(page, 'Payment status'), 'Cancel order'));
  const countdown = timer(region(page, 'Payment status'));
  await visible(countdown);
  const before = await countdownSeconds(countdown);
  expect(before).toBeGreaterThan(0);
  await expect.poll(() => countdownSeconds(countdown)).toBeLessThan(before);
});

test('REQ-4.4: Read refund and change conditions', async ({ page }) => {
  await openHome(page);
  await bookUnpaidOrder(page);
  await button(region(page, 'Flight itinerary'), 'Refund and change rules').click();
  await textVisible(region(page, 'Flight itinerary'), 'Refund fee: ¥100');
  await textVisible(region(page, 'Flight itinerary'), 'Changes allowed before departure');
});
