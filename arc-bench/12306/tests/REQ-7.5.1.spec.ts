// requirement: REQ-7.5.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, addPassenger, manager } from './helpers';
test("REQ-7.5.1: Search passenger name", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassenger(page, 'Cancel Passenger', 'P20269982');
    await page.getByPlaceholder('Please enter passenger name', { exact: true }).fill('Passenger Example');
    await button(page, 'Search').click();
    await expect(row(page, 'P20269999')).toContainText('Passenger Example');
    await expect(row(page, 'P20269982')).not.toBeVisible();
});
test("REQ-7.5.1: Search passenger ID", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassenger(page, 'Cancel Passenger', 'P20269982');
    await page.getByPlaceholder('Please enter passenger name', { exact: true }).fill('P20269999');
    await button(page, 'Search').click();
    await expect(row(page, 'P20269999')).toContainText('Passenger Example');
    await expect(row(page, 'P20269982')).not.toBeVisible();
});
