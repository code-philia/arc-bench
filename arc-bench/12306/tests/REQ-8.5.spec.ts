// requirement: REQ-8.5
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, row, orders, payment } from './helpers';
test("REQ-8.5: Pay and persist upcoming state", async ({ page }) => {
    await entry(page);
    await payment(page, 'booking_paid_user');
    await button(page, 'Pay').click();
    await text(page, 'Payment successful.');
    await orders(page, 'Upcoming trips');
    await expect(row(page, 'G1001')).toContainText('Paid');
    await expect(button(row(page, 'G1001'), 'Refund')).toBeVisible();
    await page.reload();
    await expect(row(page, 'G1001')).toContainText('Paid');
});
