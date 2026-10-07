// requirement: REQ-8.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, orders, payment } from './helpers';
test("REQ-8.6: Persist unpaid order category", async ({ page }) => {
    await entry(page);
    await payment(page, 'booking_unpaid_user');
    await orders(page, 'Uncompleted orders');
    await expect(row(page, 'G1001')).toContainText('Unpaid');
    await expect(button(row(page, 'G1001'), 'Pay')).toBeVisible();
    await page.reload();
    await expect(row(page, 'G1001')).toContainText('Unpaid');
    await page.getByRole('tab', { name: 'Upcoming trips', exact: true }).click();
    await expect(row(page, 'G1001')).toHaveCount(0);
});
