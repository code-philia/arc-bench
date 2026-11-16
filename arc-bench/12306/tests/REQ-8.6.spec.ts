// requirement: REQ-8.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, orderRow, orders, payAction, payment, tab } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.6: Persist unpaid order category", async ({ page }) => {
    await entry(page);
    const journey = await payment(page, bookingAccounts.unpaid);
    await orders(page, 'Uncompleted orders');
    await expect(orderRow(page, journey)).toContainText('Unpaid');
    await expect(payAction(orderRow(page, journey))).toBeVisible();
    await page.reload();
    await expect(orderRow(page, journey)).toContainText('Unpaid');
    await tab(page, 'Upcoming trips').click();
    await expect(orderRow(page, journey)).toHaveCount(0);
});
