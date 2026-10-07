// requirement: REQ-8.7
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, row, orders, confirmation, payment } from './helpers';
test("REQ-8.7: Cancel persist status and release seat", async ({ page }) => {
    await entry(page);
    await payment(page, 'booking_cancel_user');
    await button(page, 'Cancel').click();
    await text(page, 'Order cancelled successfully.');
    await orders(page, 'Uncompleted orders');
    await expect(row(page, 'G1001')).toContainText('Cancelled');
    await expect(button(row(page, 'G1001'), 'Pay')).toHaveCount(0);
    await page.reload();
    await expect(row(page, 'G1001')).toContainText('Cancelled');
    await confirmation(page, 'booking_cancel_user', true);
});
