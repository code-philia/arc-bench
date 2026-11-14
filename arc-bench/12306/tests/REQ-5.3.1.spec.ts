// requirement: REQ-5.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, orderRow, orderSetup, orders, payAction } from './helpers';
import { bookingAccounts } from './fixtures/data';

test("REQ-5.3.1: Open unpaid-order view", async ({ page }) => {
  await entry(page);
  const journey = await orderSetup(page, bookingAccounts.resume);
  await orders(page, 'Uncompleted orders');
  await expect(payAction(orderRow(page, journey))).toBeVisible();
});
