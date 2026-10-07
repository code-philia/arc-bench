// requirement: REQ-4.6
import { test, expect } from "@playwright/test";
import { button, region, dialog, visible, textVisible, openHome, installClock, openOrderDetails } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.6: Keep an unpaid order when cancellation is declined', async ({ page }, testInfo) => {
  await openHome(page);
  await openOrderDetails(page, 'order_read', 'CTRIP20260721001');
  await button(region(page, 'Payment status'), 'Cancel order').click();
  await button(dialog(page, 'Cancel order'), 'Keep order').click();
  await expect(dialog(page, 'Cancel order')).toHaveCount(0);
  await textVisible(page, 'CTRIP20260721001');
  await textVisible(region(page, 'Payment status'), 'Pending payment');
  await visible(button(region(page, 'Payment status'), 'Pay now'));
});
