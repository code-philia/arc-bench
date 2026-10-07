// requirement: REQ-8.8.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, row, center, orders, confirmation, orderSetup } from './helpers';
test("REQ-8.8.1: Confirm order-center cancellation", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_cancel_center_user');
    await orders(page, 'Uncompleted orders');
    await button(row(page, 'G1001'), 'Cancel').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to cancel this order?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Order cancelled successfully.');
    await expect(row(page, 'G1001')).toContainText('Cancelled');
    await expect(button(row(page, 'G1001'), 'Pay')).toHaveCount(0);
    await confirmation(page, 'orders_cancel_center_user', true);
});
