// requirement: REQ-8.2.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, row, booking } from './helpers';
test("REQ-8.2.2.2: Remove selected booking passenger", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await page.getByRole('checkbox', { name: 'Passenger Example', exact: true }).check();
    const table = page.getByRole('table', { name: 'Booking passengers', exact: true });
    await button(row(table, 'P20269997'), 'Delete').click();
    await expect(row(table, 'P20269997')).toHaveCount(0);
    await button(page, 'Place order').click();
    await text(page, 'Please select at least one passenger.');
    await expect(page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true })).not.toBeVisible();
});
