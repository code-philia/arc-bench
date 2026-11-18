// requirement: REQ-4.4
import { expect } from "@playwright/test";
import { test, button, region, visible, textVisible, textToken, renderedTextVisible, openHome, bookUnpaidOrder, countdownSeconds, timer, unpaidOrderExpiry } from "./helpers";
import { preferredVisible } from './ui';

test('REQ-4.4: Inspect unpaid itinerary and payment countdown', async ({ page }) => {
  await openHome(page);
  const number = await bookUnpaidOrder(page);
  await textVisible(page, textToken(number));
  await textVisible(region(page, 'Flight itinerary'), textToken('JD5162'));
  await textVisible(region(page, 'Flight itinerary'), /^Chengdu\s*(?:to|[-–—→])\s*Guangzhou$/i);
  await visible(button(region(page, 'Flight itinerary'), 'Refund and change rules'));
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  await textVisible(region(page, 'Payment status'), unpaidOrderExpiry);
  await visible(button(region(page, 'Payment status'), 'Pay now'));
  await visible(button(region(page, 'Payment status'), 'Cancel order'));
  const paymentStatus = region(page, 'Payment status');
  const countdown = await preferredVisible(paymentStatus.getByRole('timer', { name: 'Time remaining', exact: true }),
    timer(paymentStatus));
  const before = await countdownSeconds(countdown);
  expect(before).toBeGreaterThan(0);
  await expect.poll(() => countdownSeconds(countdown)).toBeLessThan(before);
});

test('REQ-4.4: Read refund and change conditions', async ({ page }) => {
  await openHome(page);
  await bookUnpaidOrder(page);
  await button(region(page, 'Flight itinerary'), 'Refund and change rules').click();
  await renderedTextVisible(region(page, 'Flight itinerary'), textToken('Refund fee: ¥100'));
  await renderedTextVisible(region(page, 'Flight itinerary'), textToken('Changes allowed before departure'));
});
