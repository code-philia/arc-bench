// requirement: REQ-7.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, dialog, entry, manager, row } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.3.2: Dismiss passenger deletion", async ({ page }) => {
    await entry(page);
    await manager(page);
    const passenger = newPassenger();
    await addPassenger(page, passenger);
    await button(row(page, passenger.passport), 'Delete').click();
    const d = dialog(page, 'Are you sure you want to delete this passenger?');
    await expect(d).toBeVisible();
    await button(d, 'Cancel').click();
    await expect(d).not.toBeVisible();
    await expect(row(page, passenger.passport)).toBeVisible();
    await page.reload();
    await expect(row(page, passenger.passport)).toBeVisible();
});
