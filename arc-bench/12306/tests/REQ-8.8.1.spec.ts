// requirement: REQ-8.8.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, confirmation, dialog, entry, orderRow, orderSetup, orders, payAction, text } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.8.1: Confirm order-center cancellation", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.cancelFromOrders);
    await orders(page, 'Uncompleted orders');
    await button(orderRow(page, journey), 'Cancel').click();
    const d = dialog(page, 'Are you sure you want to cancel this order?');
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Order cancelled successfully.');
    journey.state = 'closed';
    await expect(orderRow(page, journey)).toContainText('Cancelled');
    await expect(payAction(orderRow(page, journey))).toHaveCount(0);
    await confirmation(page, bookingAccounts.cancelFromOrders, journey.date, journey.train, journey);
});
