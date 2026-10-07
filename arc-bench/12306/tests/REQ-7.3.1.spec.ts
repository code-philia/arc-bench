// requirement: REQ-7.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, row, login, passengerPage, addPassenger } from './helpers';
test("REQ-7.3.1: Confirm passenger deletion", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Delete Passenger', 'P20269981');
    await button(row(page, 'P20269981'), 'Delete').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to delete this passenger?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Passenger deleted successfully.');
    await expect(row(page, 'P20269981')).toHaveCount(0);
    await page.reload();
    await expect(row(page, 'P20269981')).toHaveCount(0);
});
