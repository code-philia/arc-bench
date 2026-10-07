// requirement: REQ-8.3.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, orders, confirmation } from './helpers';
test("REQ-8.3.2.2: Edit without submitting", async ({ page }) => {
    await entry(page);
    await confirmation(page, 'booking_edit_user');
    const d = page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true });
    await button(d, 'Edit').click();
    await expect(d).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Train Information:', exact: true })).toBeVisible();
    await expect(button(page, 'Place order')).toBeVisible();
    await orders(page, 'Uncompleted orders');
    await expect(row(page, 'G1001')).toHaveCount(0);
});
