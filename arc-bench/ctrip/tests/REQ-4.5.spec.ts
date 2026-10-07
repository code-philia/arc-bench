// requirement: REQ-4.5
import { test, expect } from "@playwright/test";
import { button, region, dialog, textVisible, openHome, installClock, openOrderDetails } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.5: Confirm unpaid order cancellation', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrderDetails(page, 'order_cancel', 'CTRIP20260721004');
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  await button(region(page, 'Payment status'), 'Cancel order').click();
  await button(dialog(page, 'Cancel order'), 'Confirm cancellation').click();
  await textVisible(page, 'CTRIP20260721004');
  await textVisible(region(page, 'Payment status'), 'Closed');
  await page.reload();
  await textVisible(page, 'CTRIP20260721004');
  await textVisible(region(page, 'Payment status'), 'Closed');
});

