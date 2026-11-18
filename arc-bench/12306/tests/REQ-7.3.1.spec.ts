// requirement: REQ-7.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, dialog, entry, manager, passengerRow, text } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.3.1: Confirm passenger deletion", async ({ page }) => {
    await entry(page);
    await manager(page);
    const passenger = newPassenger();
    await addPassenger(page, passenger);
    const record = passengerRow(page, passenger.name);
    await button(record, 'Delete').click();
    const d = dialog(page, 'Are you sure you want to delete this passenger?');
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Passenger deleted successfully.');
    await expect(record).toHaveCount(0);
    await page.reload();
    await expect(record).toHaveCount(0);
});
