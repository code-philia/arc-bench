// requirement: REQ-8.5
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, orderRow, orders, payOrder, payment } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.5: Pay and persist upcoming state", async ({ page }) => {
    await entry(page);
    const journey = await payment(page, bookingAccounts.paid);
    await payOrder(page, journey);
    await orders(page, 'Upcoming trips');
    await expect(orderRow(page, journey)).toContainText('Paid');
    await expect(button(orderRow(page, journey), 'Refund')).toBeVisible();
    await page.reload();
    await expect(orderRow(page, journey)).toContainText('Paid');
});
