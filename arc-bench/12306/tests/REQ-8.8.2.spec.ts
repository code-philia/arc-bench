// requirement: REQ-8.8.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, center, orders, orderSetup } from './helpers';
test("REQ-8.8.2: Dismiss order-center cancellation", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_unpaid_dismiss_user');
    await orders(page, 'Uncompleted orders');
    await button(row(page, 'G1001'), 'Cancel').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to cancel this order?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Cancel').click();
    await expect(d).not.toBeVisible();
    await expect(row(page, 'G1001')).toContainText('Unpaid');
    await expect(button(row(page, 'G1001'), 'Pay')).toBeVisible();
});
