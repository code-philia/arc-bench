// requirement: REQ-8.7
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, confirmation, entry, orderRow, orders, payAction, payment, text } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.7: Cancel persist status and release seat", async ({ page }) => {
    await entry(page);
    const journey = await payment(page, bookingAccounts.cancel);
    await button(page, 'Cancel').click();
    await text(page, 'Order cancelled successfully.');
    journey.state = 'closed';
    await orders(page, 'Uncompleted orders');
    await expect(orderRow(page, journey)).toContainText('Cancelled');
    await expect(payAction(orderRow(page, journey))).toHaveCount(0);
    await page.reload();
    await expect(orderRow(page, journey)).toContainText('Cancelled');
    await confirmation(page, bookingAccounts.cancel, journey.date, journey.train, journey);
});
