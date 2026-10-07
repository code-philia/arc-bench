// requirement: REQ-7.5.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, search, addPassenger, manager } from './helpers';
test("REQ-7.5.2: Clear passenger search", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassenger(page, 'Cancel Passenger', 'P20269982');
    await page.getByPlaceholder('Please enter passenger name', { exact: true }).fill('Passenger Example');
    await button(page, 'Search').click();
    await expect(row(page, 'P20269982')).not.toBeVisible();
    await button(page, '×').click();
    await expect(page.getByPlaceholder('Please enter passenger name', { exact: true })).toHaveValue('');
    await expect(row(page, 'P20269999')).toBeVisible();
    await expect(row(page, 'P20269982')).toBeVisible();
});
