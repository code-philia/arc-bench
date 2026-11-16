// requirement: REQ-8.3.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, confirmation, confirmationDialog, entry, heading, orderRow, orders } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.3.3.2: Edit without submitting", async ({ page }) => {
    await entry(page);
    const journey = await confirmation(page, bookingAccounts.edit);
    const d = confirmationDialog(page);
    await button(d, 'Edit').click();
    await expect(d).not.toBeVisible();
    await expect(heading(page, /^Train Information:?$/i)).toBeVisible();
    await expect(button(page, 'Place order')).toBeVisible();
    await orders(page, 'Uncompleted orders');
    await expect(orderRow(page, journey)).toHaveCount(0);
});
