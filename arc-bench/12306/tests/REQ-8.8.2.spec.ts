// requirement: REQ-8.8.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, dialog, entry, orderRow, orderSetup, orders, payAction } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.8.2: Dismiss order-center cancellation", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.dismissCancellation);
    await orders(page, 'Uncompleted orders');
    await button(orderRow(page, journey), 'Cancel').click();
    const d = dialog(page, 'Are you sure you want to cancel this order?');
    await expect(d).toBeVisible();
    await button(d, 'Cancel').click();
    await expect(d).not.toBeVisible();
    await expect(orderRow(page, journey)).toContainText('Unpaid');
    await expect(payAction(orderRow(page, journey))).toBeVisible();
});
